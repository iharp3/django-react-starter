import numpy as np
import pandas as pd
import xarray as xr

from api.iharp_query_processor.src.utils.const import DataRange, get_lat_lon_range, time_resolution_to_freq

_f_path = ""
_df_meta: pd.DataFrame

def init_metadata(f_path):
    global _f_path, _df_meta
    _f_path = f_path
    _df_meta = pd.read_csv(f_path)

def add_metadata(dr: DataRange):
    pass

def remove_metadata(dr: DataRange):
    pass


class Coverage:
    def __init__(self, dataset, variable, time_range, spatial, meta=None):
        self.dataset = dataset
        self.variable = variable
        self.time_range = time_range    # (start, end)
        self.spatial = spatial          # dict (dataset specific)
        self.meta = meta                # optional, e.g. file_path

DATASET_ADAPTERS = {
    "ERA5": {
        "spatial_overlap": lambda q, m: (   # check mins of q and m are both less than smallest max
            max(q["min_lat"], m["min_lat"]) <= min(q["max_lat"], m["max_lat"])
            and max(q["min_lon"], m["min_lon"]) <= min(q["max_lon"], m["max_lon"])
        ),
        "spatial_subtract": "bbox",
    },
    "CARRA": {
        "spatial_overlap": lambda q, m: q["domain"] == m["domain"],
        "spatial_subtract": "domain",
    },
}

def subtract_time_range(qt, mt):
    qs, qe = qt
    ms, me = mt

    if me < qs or ms >= qe:
        return [(qs, qe)]   # no overlap
    
    pieces = []
    if qs < ms:
        pieces.append((qs, ms))
    if me < qe:
        pieces.append((me, qe))

    return pieces
    
def subtract_bbox(q, m):
    pieces = []

    qlat = (q["min_lat"], q["max_lat"])
    qlon = (q["min_lon"], q["max_lon"])
    mlat = (m["min_lat"], m["max_lat"])
    mlon = (m["min_lon"], m["max_lon"])

    lat_overlap = (max(qlat[0], mlat[0]), min(qlat[1], mlat[1]))
    lon_overlap = (max(qlon[0], mlon[0]), min(qlon[1], mlon[1]))

    if lat_overlap[0] > lat_overlap[1] or lon_overlap[0] >= lon_overlap[1]:
        return [q]

    pieces.extend([
    {"min_lat": qlat[0], "max_lat": lat_overlap[0], "min_lon": *qlon},
    {"min_lat": lat_overlap[1], "max_lat": qlat[1], "min_lon": *qlon},
    {"min_lat": *lat_overlap, "min_lon": qlon[0], "max_lon": lon_overlap[0]},
    {"min_lat": *lat_overlap, "min_lon": lon_overlap[1], "max_lon": qlon[1]},
    ])

    return [p for p in pieces if p["min_lat"] < p["max_lat"] and p["min_lon"] < p["max_lon"]]

def query_get_overlap_and_leftover(dr: DataRange):
    adapter = DATASET_ADAPTERS[dr.dataset]

    df_overlap = _df_meta[
        (_df_meta["dataset"] == dr.dataset)
        & (_df_meta["variable"] == dr.variable)
        & (pd.to_datetime(_df_meta["end_datetime"]) >= pd.to_datetime(dr.start_datetime))
        & (pd.to_datetime(_df_meta["start_datetime"]) <= pd.to_datetime(dr.end_datetime))
    ]

    if dr.dataset == "ERA5":
        df_overlap = df_overlap[
            (_df_meta["min_lat"] <= dr.max_lat)
            & (_df_meta["max_lat"] >= dr.min_lat)
            & (_df_meta["min_lon"] <= dr.max_lon)
            & (_df_meta["max_lon"] >= dr.min_lon)
        ]
    elif dr.dataset == "CARRA":
        df_overlap = df_overlap[_df_meta["domain"] == dr.domain]

    query_cov = Coverage(
        dr.dataset,
        dr.variable,
        (pd.Timestamp(dr.start_datetime), pd.Timestamp(dr.end_datetime)),
        (
            {
                "min_lat": dr.min_lat,
                "max_lat": dr.max_lat,
                "min_lon": dr.min_lon,
                "max_lon": dr.max_lon,
            }
            if dr.dataset == "ERA5"
            else {"domain": dr.domain}
        ),
    )

    meta_covs = []
    for row in df_overlap.itertuples():
        spatial = (
            {
                "min_lat": row.min_lat,
                "max_lat": row.max_lat,
                "min_lon": row.min_lon,
                "max_lon": row.max_lon,
            }
            if dr.dataset == "ERA5"
            else {"domain": row.domain}
        )

        meta_covs.append(
            Coverage(
                row.dataset,
                row.variable,
                (pd.Timestamp(row.start_datetime), pd.Timestamp(row.end_datetime)),
                spatial,
                meta= row,
            )
        )

    remaining = [query_cov]

    for meta in meta_covs:
        new_remaining = []

        for r in remaining:
            if not adapter["spatial_overlap"](r.spatial, meta.spatial):
                new_remaining.append(r)
                continue
            time_pieces = subtract_time_range(r.time_range, meta.time_range)

            for tp in time_pieces:
                new_remaining.append(
                    Coverage(r.dataset, r.variable, tp, r.spatial)
                )
        remaining = new_remaining
    
    return df_overlap, remaining


def _gen_empty_xarray(
    min_lat,
    max_lat,
    min_lon,
    max_lon,
    start_datetime,
    end_datetime,
    temporal_resolution,
    spatial_resolution,
    dataset,
    domain,
):# TODO: check this works to create an empty xarray for CARRA data
    lat_range, lon_range, lat_range_reverse = get_lat_lon_range(spatial_resolution, dataset, domain)
    lat_start = lat_range.searchsorted(min_lat, side="left")
    lat_end = lat_range.searchsorted(max_lat, side="right")
    lat_reverse_start = len(lat_range) - lat_end
    lat_reverse_end = len(lat_range) - lat_start
    lon_start = lon_range.searchsorted(min_lon, side="left")
    lon_end = lon_range.searchsorted(max_lon, side="right")
    ds_empty = xr.Dataset()
    ds_empty["time"] = pd.date_range(
        start=start_datetime,
        end=end_datetime,
        freq=time_resolution_to_freq(temporal_resolution),
    )
    ds_empty["latitude"] = lat_range_reverse[lat_reverse_start:lat_reverse_end]
    ds_empty["longitude"] = lon_range[lon_start:lon_end]
    return ds_empty

def _gen_xarray_for_meta_row(row, overwrite_temporal_resolution=None):
    if overwrite_temporal_resolution is not None:
        t_resolution = overwrite_temporal_resolution
    else:
        t_resolution = row.temporal_resolution
    return _gen_empty_xarray(
        row.min_lat,
        row.max_lat,
        row.min_lon,
        row.max_lon,
        row.start_datetime,
        row.end_datetime,
        t_resolution,
        row.spatial_resolution,
        row.dataset,
        row.domain,
        # TODO: add height for CARRA dataset
    )

def _mask_query_with_meta(ds_query, ds_meta):
    if ds_query["dataset"] == "CARRA":
        return (
            ds_query["time"].isin(ds_meta["time"])
            & ds_query["domain"].isin(ds_meta["domain"])
        )
    else:   # TODO: make general, not just ERA5
        return (
            ds_query["time"].isin(ds_meta["time"])
            & ds_query["latitude"].isin(ds_meta["latitude"])
            & ds_query["longitude"].isin(ds_meta["longitude"])
        )

# def query_get_overlap_and_leftover(dr: DataRange):
#     df_overlap = _df_meta[
#         (_df_meta["dataset"] == dr.dataset)
#         & (_df_meta["variable"] == dr.variable)
#         & (_df_meta["min_lat"] <= dr.max_lat)   # TODO: change location to domain for carra data?
#         & (_df_meta["max_lat"] >= dr.min_lat)
#         & (_df_meta["min_lon"] <= dr.max_lon)
#         & (_df_meta["max_lon"] >= dr.min_lon)
#         & (pd.to_datetime(_df_meta["start_datetime"]) <= pd.to_datetime(dr.end_datetime))
#         & (pd.to_datetime(_df_meta["end_datetime"]) >= pd.to_datetime(dr.start_datetime))
#         & (_df_meta["temporal_resolution"] == dr.temporal_resolution)
#         & (_df_meta["spatial_resolution"] == dr.spatial_resolution)
#         & (_df_meta["aggregation"] == dr.aggregation)
#     ]

#     ds_query = _gen_empty_xarray(
#         dr.min_lat,
#         dr.max_lat,
#         dr.min_lon,
#         dr.max_lon,
#         dr.start_datetime,
#         dr.end_datetime,
#         dr.temporal_resolution,
#         dr.spatial_resolution,
#         dr.dataset,
#         dr.domain,
#     )

#     false_mask = xr.DataArray(
#         data=np.zeros(
#             (
#                 ds_query.sizes["time"],
#                 ds_query.sizes["latitude"],
#                 ds_query.sizes["longitude"],
#             ),
#             dtype=bool,
#         ),
#         coords={
#             "time": ds_query["time"],
#             "latitude": ds_query["latitude"],
#             "longitude": ds_query["longitude"],
#         },
#         dims=["time", "latitude", "longitude"],
#     )

#     for row in df_overlap.itertuples():
#         ds_meta = _gen_xarray_for_meta_row(row)
#         mask = _mask_query_with_meta(ds_query, ds_meta)
#         false_mask = false_mask | mask

#     leftover = false_mask.where(false_mask == False, drop=True)
#     if leftover.values.size > 0:
#         return df_overlap, leftover
#     else:
#         return df_overlap, None
