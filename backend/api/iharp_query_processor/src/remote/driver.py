import traceback
import tomllib

from typing import Dict
from src.remote.models import RemoteRequestConfig, RemoteDownloadResult
from src.remote.era5 import ERA5Repository
from src.remote.carra import CARRARepository

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