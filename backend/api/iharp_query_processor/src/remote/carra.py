import datetime
import cdsapi

from typing import List
from src.remote.base import RemoteRepository

class CARRARepository(RemoteRepository):

    DATASET = "reanalysis-carra-height-levels"
    DATADIR = "/data/carra/"

    def _gen_filename(self):

        ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        fname = f"carra_{ts}.nc"

        return self.DATADIR + fname
    
    # TODO: write function to turn lat/lon info into East or West domain
    
    def _build_request(self):

        cfg = self.config

        return {
            "domain": cfg.domain,
            "product_type": ["analysis"],
            "variable": [cfg.variable],
            "height_level": [cfg.height_level],
            "year": cfg.years,
            "month": cfg.months,
            "day": cfg.days,
            "time": ["00:00", "03:00", "06:00","09:00", "12:00", "15:00","18:00", "21:00"],
            "data_format": "netcdf",
        }
    
    def download(self) ->List[str]:

        client = cdsapi.Client()
        request = self._build_request()
        fname = self._gen_filename()

        print("\n===== Repository.download() =====")
        print("Dataset:", self.DATASET)
        print("Request:")
        print(request)
        print("Output file:", fname)

        client.retrieve(self.DATASET, request).download(fname)

        return[fname]
    