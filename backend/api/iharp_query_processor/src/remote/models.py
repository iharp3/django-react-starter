from dataclasses import dataclass, field
from typing import List, Dict, Any

@dataclass
class RemoteRequestConfig:

    dataset:str

    variable:str

    years: List[str]

    months: List[str]

    days: List[str]

    min_lat: float | None = None
    max_lat: float | None = None

    min_lon: float | None = None
    max_lon: float | None = None

    domain: str | None = None

    height_level: str | None = None

@dataclass
class RemoteDownloadResult:

    success: bool

    files: List[str] = field(default_factory=list)

    log: Dict[str, Any] = field(default_factory=dict)

    error: str | None = None