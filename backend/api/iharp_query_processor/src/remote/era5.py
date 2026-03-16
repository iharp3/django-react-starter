import datetime
import cdsapi

from typing import List
from src.remote.base import RemoteRepository

class ERA5Repository(RemoteRepository):

    DATASET = "reanalysis-era5-single-levels"
    DATADIR = "/data/"

    def _gen_filename(self):

        ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        fname = f"era5_{ts}.nc"

        return self.DATADIR + fname
    
    def _build_request(self):

        cfg = self.config

        return {
            "product_type": ["reanalysis"],
            "variable": [cfg.variable],
            "year": cfg.years,
            "month": cfg.months,
            "day": cfg.days,
            "time": [f"{i:02d}" for i in range(24)],
            "data_format": "netcdf",
            "download_format": "unarchived",
            "area": [
                cfg.max_lat,
                cfg.min_lon,
                cfg.min_lat,
                cfg.max_lon,
            ],
        }
    
    def download(self) -> List[str]:

        client = cdsapi.Client()
        request = self._build_request()
        fname = self._gen_filename()
        client.retrieve(self.DATASET, request).download(fname)

        return [fname]