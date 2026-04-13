from dask.distributed import LocalCluster
import dask
import xarray as xr
import os

from src.utils.const import long_short_name_dict, encodings, DataRange
from src.query_monitor import keep_file

class Aggregate:

    STATS = ["mean", "min", "max"]

    TEMPORAL_FREQS = {
        "day": "D",
        "month": "ME",
        "year": "YE",
    }

    SPATIAL_SCALES = {
        "05": 2,
        "1": 4,
    }

    PRECISION_LEVELS = {
        # ["hour", "025"],
        ("day", "025"): 2,
        ("month", "05"): 3,
        ("year", "1"): 4
    }

    CHUNKS = {
        "time": 24,
        "latitude": 180,
        "longitude": 360,
    }

    def __init__(self, file_name: str, dataset: str, variable: str, time_range: str):
        self.file_name = file_name
        self.dataset = dataset
        self.variable = variable
        self.time_range = time_range

        self.short_name = long_short_name_dict[variable]
        self.encoding = {self.short_name: encodings[dataset]}
        self.base_name = f"{variable}_{time_range}"

    def _apply_stat(self, obj, stat):
        return getattr(obj, stat)()

    def _spatial_aggregate(self, ds, stat):
        """Return spatially aggregated datasets."""

        outputs = {}
        for label, coarse in self.SPATIAL_SCALES.items():
            coarsened = ds.coarsen(
                latitude=coarse,
                longitude=coarse,
                boundary="trim",
            )
            outputs[label] = self._apply_stat(coarsened, stat)

        return outputs

    def time_driver(self):

        print(f"Temporal aggregation: {self.file_name}")

        ds = xr.open_dataset(
            f"/data/{self.dataset}/{self.file_name}.nc",
            chunks=self.CHUNKS,
        )

        writes = []

        for label, freq in self.TEMPORAL_FREQS.items():
            resampler = ds.resample(valid_time=freq)
            for stat in self.STATS:
                result = self._apply_stat(resampler, stat)
                outfile = f"{self.base_name}_025{label}_{stat}.nc"
                delayed = result.to_netcdf(
                    outfile,
                    encoding=self.encoding,
                    compute=False,
                )
                writes.append(delayed)

        dask.compute(*writes)

    def space_driver(self):

        print(f"Spatial aggregation: {self.file_name}")

        writes = []

        for time_label in self.TEMPORAL_FREQS.keys():
            for stat in self.STATS:
                infile = f"{self.base_name}_025{time_label}_{stat}.nc"      # ASSUMING file names are in format defined in time_driver()
                ds = xr.open_dataset(
                    infile,
                    chunks=self.CHUNKS,
                )
                spatial_outputs = self._spatial_aggregate(ds, stat)
                for space_label, result in spatial_outputs.items():
                    outfile = f"{self.base_name}_{space_label}{time_label}_{stat}.nc"
                    delayed = result.to_netcdf(
                        outfile,
                        encoding=self.encoding,
                        compute=False,
                    )
                    writes.append(delayed)

        dask.compute(*writes)

    def finest_space_driver(self):

        print(f"Hourly spatial aggregation: {self.file_name}")

        ds = xr.open_dataset(
            f"/data/{self.dataset}/{self.file_name}.nc",
            chunks=self.CHUNKS,
        )

        writes = []

        for stat in self.STATS:
            spatial_outputs = self._spatial_aggregate(ds, stat)
            for space_label, result in spatial_outputs.items():
                outfile = f"{self.base_name}_{space_label}hour_{stat}.nc"
                delayed = result.to_netcdf(
                    outfile,
                    encoding=self.encoding,
                    compute=False,
                )
                writes.append(delayed)

        dask.compute(*writes)

    
    def execute_upsample(self, init_dr: DataRange):
        """Upsamples a downloaded file and saves it at every defined precision level"""
        with LocalCluster(n_workers=10) as cluster:

            client = cluster.get_client()

            ds = xr.open_dataset(
                self.file_name,
                chunks=self.CHUNKS,
            )

            writes = []
            new_files = []
            for precisions, _ in self.PRECISION_LEVELS.items():
                t_res = precisions[0]
                s_res = precisions[1]
                resampler = ds.resample(valid_time=self.TEMPORAL_FREQS[t_res])

                for stat in self.STATS:
                    result = self._apply_stat(resampler, stat)

                    if s_res != "025":
                        coarsened = result.coarsen(
                        latitude=self.SPATIAL_SCALES[s_res],
                        longitude=self.SPATIAL_SCALES[s_res],
                        boundary="trim",
                        )
                        result = self._apply_stat(coarsened, stat)

                    outfile = f"{self.base_name}_{s_res}{t_res}_{stat}.nc"
                    directory = os.path.dirname(self.file_name)

                    delayed = result.to_netcdf(
                        directory + "/" + outfile,
                        encoding=self.encoding,
                        compute=False,
                    )
                    writes.append(delayed)

                    new_dr = init_dr.__copy__()
                    if s_res == "025":
                        new_dr.spatial_resolution = 0.25
                    elif s_res == "05":
                        new_dr.spatial_resolution = 0.5
                    elif s_res == "1":
                        new_dr.spatial_resolution = 1
                    new_dr.temporal_resolution = t_res
                    new_dr.aggregation = stat
                    new_files.append((new_dr, outfile))
            
            dask.compute(*writes)

            for dr, file_path in new_files:
                keep_file(dr, file_path)
            
            client.close()

    def execute(self):

        with LocalCluster(n_workers=10) as cluster:

            client = cluster.get_client()

            self.time_driver()
            self.space_driver()
            self.finest_space_driver()

            client.close()