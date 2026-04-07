import traceback
import tomllib

from typing import Dict
from src.remote.models import RemoteRequestConfig, RemoteDownloadResult
from src.remote.era5 import ERA5Repository
from src.remote.carra import CARRARepository
from src.query_monitor import keep_file
from src.utils.const import DataRange

class RequestRemoteData:
    def __init__(self, config: RemoteRequestConfig):
        self.config = config

    @classmethod
    def from_toml(cls, path:str):

        with open(path, "rb") as f:
            data = tomllib.load(f)
            
        config = RemoteRequestConfig(**data)

        return cls(config)
    
    @classmethod
    def from_dict(cls, data: Dict):

        config = RemoteRequestConfig(**data)

        return cls(config)
    
    def _to_datarange(self):
        start_year = str(self.config.years[0])
        start_month = str(self.config.months[0]).zfill(2)
        start_day = str(self.config.days[0]).zfill(2)
        start_date = start_year + '-' + start_month + '-' + start_day + ' 00:00'

        end_year = str(self.config.years[-1])
        end_month = str(self.config.months[-1]).zfill(2)
        end_day = str(self.config.days[-1]).zfill(2)
        end_date = end_year + '-' + end_month + '-' + end_day + ' 23:00'

        return DataRange(
            dataset=self.config.dataset,
            variable=self.config.variable,
            start_datetime=start_date,
            end_datetime=end_date,
            min_lat=self.config.min_lat,
            max_lat=self.config.max_lat,
            min_lon=self.config.min_lon,
            max_lon=self.config.max_lon,
            # This is probably different between datasets, look into it?
            temporal_resolution="hour",
            spatial_resolution=0.25,
            aggregation="none",
            domain=self.config.domain,
            height_level=self.config.height_level
        )
        
    def _get_repository(self):

        dataset = self.config.dataset.lower()

        if dataset == "era5":
            return ERA5Repository(self.config)
        
        if dataset == "carra":
            return CARRARepository(self.config)
        
        raise ValueError(f"Unsupported dataset: {dataset}")
    
    def execute(self) -> RemoteDownloadResult:

        try:
            # TODO: add max size values to each dataset class and 
            # split data into various _get_repository/download calls to be within the size
            
            repo = self._get_repository()

            # print("\n===== RequestRemoteData.execute() =====")
            # print("Config:")
            # print(self.config)
            # print("Repository selected:", type(repo).__name__)

            # TODO: decide where downloaded files will go
            files = repo.download()

            # TODO: Modify logging once we decide to start splitting files
            meta_dr = self._to_datarange()
            keep_file(meta_dr, files[0])

            return RemoteDownloadResult(
                success = True,
                files = files,
                log = {
                    "dataset": self.config.dataset,
                    "files_downloaded": len(files),
                },
            )
        except Exception as e:
            
            return RemoteDownloadResult(
                success = False,
                error = str(e),
                log = {
                    "traceback": traceback.format_exc()
                }
            )