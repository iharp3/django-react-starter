from abc import ABC, abstractmethod
from typing import List
from api.iharp_query_processor.src.remote.models import RemoteRequestConfig

class RemoteRepository(ABC):

    def __init__(self, config: RemoteRequestConfig):

        self.config = config

        @abstractmethod
        def download(self) -> List[str]:
            pass