from dask.distributed import LocalCluster
import dask
import numpy as np
import xarray as xr

def time_driver():

    cluster = LocalCluster(n_workers=10)
    client = cluster.get_client()

    for region in regions:
        for variable, short_name in zip(variables, short_names):

            base_file_name = f"{variable}_{region}_2015-2024"
            print(f"Processing {base_file_name}")

            # Better chunking: allow spatial parallelism
            ds = xr.open_dataset(
                f"/data/{base_file_name}.nc",
                chunks={
                    "time": 24,          # daily-sized chunks
                    "latitude": 180,     # spatial chunking
                    "longitude": 360,
                },
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
                        encoding={short_name: era5_encoding},
                        compute=False,     # IMPORTANT: lazy
                    )

                    writes.append(delayed)

            # Trigger all writes in parallel
            dask.compute(*writes)

    client.close()
    cluster.close()