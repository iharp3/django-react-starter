from dask.distributed import LocalCluster
import dask
import xarray as xr
from src.utils.const import long_short_name_dict, encodings

class Aggregate:

    def __init__(self, file_name: str, dataset: str, variable: str, time_range: str):
        self.file_name = file_name
        self.dataset = dataset
        self.variable = variable
        self.time_range = time_range

    def finest_space_driver(self, ds: xr.Dataset, file_name: str, encoding_dict: dict):
        for stat in ["mean", "min", "max"]:
            
            writes = []
            
            for space, coarse in [("05", 2), ("1", 4)]:

                ds_coarse = ds.coarsen(
                    latitude=coarse,
                    longitude=coarse,
                    boundary="trim",
                )

                if stat == "mean":
                    result = ds_coarse.mean()
                elif stat == "min":
                    result = ds_coarse.min()
                elif stat == "max":
                    result = ds_coarse.max()

                outfile = f"{file_name}_{space}hour_{stat}.nc"

                delayed = result.to_netcdf(
                    outfile,
                    encoding=encoding_dict,
                    compute=False,
                )

                writes.append(delayed)

            # compute spatial outputs together
            dask.compute(*writes)
    
    def space_driver(self, file_name: str, dataset: str, variable: str, time_range: str ):

        print(f"Processing {file_name}")
        base_file_name = f"{variable}_{time_range}"
        encoding_dict = {long_short_name_dict[variable]: encodings[dataset]}

        for time in ["day", "month", "year"]:
            for stat in ["mean", "min", "max"]:

                infile = f"{base_file_name}_025{time}_{stat}.nc"

                ds = xr.open_dataset(
                    infile,
                    chunks={"time": 24, "latitude": 180, "longitude": 360,},    # TODO: determine how to choose chunks for lat/lon/time
                )

                self.finest_space_driver(ds=ds, file_name=file_name, encoding_dict=encoding_dict )

                writes = []

                for space, coarse in [("05", 2), ("1", 4)]:

                    ds_coarse = ds.coarsen(
                        latitude=coarse,
                        longitude=coarse,
                        boundary="trim",
                    )

                    if stat == "mean":
                        result = ds_coarse.mean()
                    elif stat == "min":
                        result = ds_coarse.min()
                    elif stat == "max":
                        result = ds_coarse.max()

                    outfile = f"{base_file_name}_{space}{time}_{stat}.nc"

                    delayed = result.to_netcdf(
                        outfile,
                        encoding=encoding_dict,
                        compute=False,
                    )

                    writes.append(delayed)
        
                # compute spatial outputs together
                dask.compute(*writes)

    def time_driver(self, file_name: str, dataset: str, variable: str, time_range: str):

        print(f"Processing {file_name}")
        base_file_name = f"{variable}_{time_range}"

        ds = xr.open_dataset(
            f"/data/{dataset}/{file_name}.nc",
            chunks={"time": 24, "latitude": 180, "longitude": 360,},    # TODO: determine how to choose chunks for lat/lon/time
        )

        # Build resamplers once
        daily_resampler   = ds.resample(valid_time="D")
        monthly_resampler = ds.resample(valid_time="ME")
        yearly_resampler  = ds.resample(valid_time="YE")

        writes = []

        for freq, resampler in [
            ("day", daily_resampler),
            ("month", monthly_resampler),
            ("year", yearly_resampler),
        ]:

            for stat, reducer in [
                ("mean", resampler.mean),
                ("min",  resampler.min),
                ("max",  resampler.max),
            ]:

                result = reducer()

                outfile = f"{base_file_name}_025{freq}_{stat}.nc"

                delayed = result.to_netcdf(
                    outfile,
                    encoding={long_short_name_dict[variable]: encodings[dataset]},
                    compute=False,
                )

                writes.append(delayed)

        # Trigger all writes in parallel
        dask.compute(*writes)

    def execute(self) -> None:

        cluster = LocalCluster(n_workers=10)
        client = cluster.get_client()

        try:
            self.time_driver(file_name=self.file_name, dataset=self.dataset, 
                        variable=self.variable, time_range=self.time_range)
            self.space_driver(file_name=self.file_name, dataset=self.dataset,
                        variable=self.variable, time_range=self.time_range)
        except Exception as e:
            client.close()
            cluster.close()
            raise RuntimeError(e)
        
        client.close()
        cluster.close()