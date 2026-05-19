from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, List, Optional

import pandas as pd

from api.iharp_query_processor.src.utils.const import DataRange


# ======================================================================================
# GLOBAL METADATA STORE
# ======================================================================================

_f_path: str = ""
_df_meta: pd.DataFrame = pd.DataFrame()


def init_metadata(f_path: str):
    """
    Load metadata CSV and normalize datatypes once.
    """

    global _f_path, _df_meta

    _f_path = f_path

    df = pd.read_csv(f_path)

    # normalize timestamps ONCE
    df["start_datetime"] = pd.to_datetime(df["start_datetime"])
    df["end_datetime"] = pd.to_datetime(df["end_datetime"])

    _df_meta = df


def add_metadata(dr: DataRange):
    raise NotImplementedError


def remove_metadata(dr: DataRange):
    raise NotImplementedError


# ======================================================================================
# REGION MODEL
# ======================================================================================

@dataclass(frozen=True)
class Region:
    dataset: str
    variable: str
    start: pd.Timestamp
    end: pd.Timestamp
    spatial: dict
    meta: Optional[object] = None

    def overlaps(self, other: "Region", spatial_intersection_fn: Callable):
        """
        Check whether two regions overlap in BOTH time and space.
        """

        # half-open interval overlap: [start, end)
        time_overlap = max(self.start, other.start) < min(self.end, other.end)

        if not time_overlap:
            return False

        spatial_overlap = (
            spatial_intersection_fn(self.spatial, other.spatial) is not None
        )

        return spatial_overlap


# ======================================================================================
# GENERIC TIME HELPERS
# ======================================================================================

def interval_intersection(a0, a1, b0, b1):
    """
    Returns intersection of two half-open intervals.
    """

    s = max(a0, b0)
    e = min(a1, b1)

    if s >= e:
        return None

    return (s, e)


# ======================================================================================
# ERA5 BBOX OPERATIONS
# ======================================================================================

def bbox_intersection(a: dict, b: dict):
    """
    Returns intersection bbox or None.
    """

    min_lat = max(a["min_lat"], b["min_lat"])
    max_lat = min(a["max_lat"], b["max_lat"])

    min_lon = max(a["min_lon"], b["min_lon"])
    max_lon = min(a["max_lon"], b["max_lon"])

    if min_lat >= max_lat:
        return None

    if min_lon >= max_lon:
        return None

    return {
        "min_lat": min_lat,
        "max_lat": max_lat,
        "min_lon": min_lon,
        "max_lon": max_lon,
    }


def bbox_subtract(q: dict, overlap: dict):
    """
    Subtract overlap bbox from query bbox.

    Can produce up to 4 non-overlapping rectangles.
    """

    qminlat = q["min_lat"]
    qmaxlat = q["max_lat"]

    qminlon = q["min_lon"]
    qmaxlon = q["max_lon"]

    ominlat = overlap["min_lat"]
    omaxlat = overlap["max_lat"]

    ominlon = overlap["min_lon"]
    omaxlon = overlap["max_lon"]

    pieces = []

    #
    # south strip
    #
    if qminlat < ominlat:
        pieces.append(
            {
                "min_lat": qminlat,
                "max_lat": ominlat,
                "min_lon": qminlon,
                "max_lon": qmaxlon,
            }
        )

    #
    # north strip
    #
    if omaxlat < qmaxlat:
        pieces.append(
            {
                "min_lat": omaxlat,
                "max_lat": qmaxlat,
                "min_lon": qminlon,
                "max_lon": qmaxlon,
            }
        )

    #
    # west strip
    #
    if qminlon < ominlon:
        pieces.append(
            {
                "min_lat": ominlat,
                "max_lat": omaxlat,
                "min_lon": qminlon,
                "max_lon": ominlon,
            }
        )

    #
    # east strip
    #
    if omaxlon < qmaxlon:
        pieces.append(
            {
                "min_lat": ominlat,
                "max_lat": omaxlat,
                "min_lon": omaxlon,
                "max_lon": qmaxlon,
            }
        )

    return pieces


# ======================================================================================
# CARRA DOMAIN OPERATIONS
# ======================================================================================

def domain_intersection(a: dict, b: dict):
    """
    Domains either fully overlap or not at all.
    """

    if a["domain"] != b["domain"]:
        return None

    return {"domain": a["domain"]}


def domain_subtract(q: dict, overlap: dict):
    """
    Domain overlap means complete coverage.
    """

    return []


# ======================================================================================
# DATASET ADAPTERS
# ======================================================================================

DATASET_ADAPTERS = {
    "ERA5": {
        "intersection": bbox_intersection,
        "subtract": bbox_subtract,
    },
    "CARRA": {
        "intersection": domain_intersection,
        "subtract": domain_subtract,
    },
}


# ======================================================================================
# REGION SUBTRACTION
# ======================================================================================

def subtract_region(
    query: Region,
    meta: Region,
    spatial_intersection_fn: Callable,
    spatial_subtract_fn: Callable,
):
    """
    Returns pieces of query not covered by meta.

    Subtraction occurs in full TIME × SPACE dimensions.
    """

    #
    # time intersection
    #
    time_inter = interval_intersection(
        query.start,
        query.end,
        meta.start,
        meta.end,
    )

    if time_inter is None:
        return [query]

    #
    # spatial intersection
    #
    spatial_inter = spatial_intersection_fn(
        query.spatial,
        meta.spatial,
    )

    if spatial_inter is None:
        return [query]

    ts, te = time_inter

    pieces: List[Region] = []

    #
    # BEFORE overlap in time
    #
    if query.start < ts:
        pieces.append(
            Region(
                dataset=query.dataset,
                variable=query.variable,
                start=query.start,
                end=ts, #TODO: keep thid time for reference
                spatial=query.spatial,
            )
        )

    #
    # AFTER overlap in time
    #
    if te < query.end:
        pieces.append(
            Region(
                dataset=query.dataset,
                variable=query.variable,
                start=te,
                end=query.end,
                spatial=query.spatial,
            )
        )

    #
    # DURING overlap in time:
    # subtract spatial overlap only
    #
    spatial_pieces = spatial_subtract_fn(
        query.spatial,
        spatial_inter,
    )

    for sp in spatial_pieces:
        pieces.append(
            Region(
                dataset=query.dataset,
                variable=query.variable,
                start=ts,
                end=te,
                spatial=sp,
            )
        )

    return pieces


# ======================================================================================
# QUERY ENTRYPOINT
# ======================================================================================

def query_get_overlap_and_leftover(dr: DataRange):

    adapter = DATASET_ADAPTERS[dr.dataset]

    #
    # normalize query timestamps
    #
    qstart = pd.Timestamp(dr.start_datetime)
    qend = pd.Timestamp(dr.end_datetime)

    #
    # metadata prefilter:
    # dataset + variable + time overlap
    #
    df = _df_meta

    mask = (
        (df["dataset"] == dr.dataset)
        & (df["variable"] == dr.variable)
        & (df["end_datetime"] > qstart)
        & (df["start_datetime"] < qend)
    )

    #
    # spatial filter
    #
    if dr.dataset == "ERA5":

        spatial_query = {
            "min_lat": dr.min_lat,
            "max_lat": dr.max_lat,
            "min_lon": dr.min_lon,
            "max_lon": dr.max_lon,
        }

        spatial_mask = (
            (df["min_lat"] < dr.max_lat)
            & (df["max_lat"] > dr.min_lat)
            & (df["min_lon"] < dr.max_lon)
            & (df["max_lon"] > dr.min_lon)
        )

        mask &= spatial_mask

    elif dr.dataset == "CARRA":

        spatial_query = {
            "domain": dr.domain,
        }

        spatial_mask = (
            df["domain"] == dr.domain
        )

        mask &= spatial_mask

    else:
        raise ValueError(f"Unsupported dataset: {dr.dataset}")

    #
    # overlapping metadata rows
    #
    df_overlap = df.loc[mask].copy()

    #
    # query region
    #
    query_region = Region(
        dataset=dr.dataset,
        variable=dr.variable,
        start=qstart,
        end=qend,
        spatial=spatial_query,
    )

    #
    # metadata regions
    #
    meta_regions: List[Region] = []

    for row in df_overlap.itertuples():

        if dr.dataset == "ERA5":

            spatial = {
                "min_lat": row.min_lat,
                "max_lat": row.max_lat,
                "min_lon": row.min_lon,
                "max_lon": row.max_lon,
            }

        else:

            spatial = {
                "domain": row.domain,
            }

        meta_regions.append(
            Region(
                dataset=row.dataset,
                variable=row.variable,
                start=row.start_datetime,
                end=row.end_datetime,
                spatial=spatial,
                meta=row,
            )
        )

    #
    # iterative subtraction
    #
    remaining = [query_region]

    for meta in meta_regions:

        next_remaining = []

        for region in remaining:

            next_remaining.extend(
                subtract_region(
                    region,
                    meta,
                    spatial_intersection_fn=adapter["intersection"],
                    spatial_subtract_fn=adapter["subtract"],
                )
            )

        remaining = next_remaining

        #
        # fully covered
        #
        if not remaining:
            break

    return df_overlap, remaining