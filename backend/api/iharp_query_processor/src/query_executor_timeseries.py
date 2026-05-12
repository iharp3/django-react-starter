from api.iharp_query_processor.src.query_executor import *
from api.iharp_query_processor.src.query_executor_get_raster import GetRasterExecutor
from api.iharp_query_processor.src.utils.const import DATASET_GRID_DIMS

class TimeseriesExecutor(QueryExecutor):
    def __init__(
        self,
        dr: DataRange,
        time_series_aggregation_method: str,  # e.g., "mean", "max", "min"
        log_info=None,
    ):
        dr.spatial_resolution = 0.25
        super().__init__(
            dr=dr,
        )
        self.time_series_aggregation_method = time_series_aggregation_method
        self.log_info = log_info if log_info is not None else []

    def execute(self):
        print("\n===== TimeseriesExecutor.execute() =====")
        print("DataRange:", self.dr)
        print("Aggregation:", self.time_series_aggregation_method)

        temp_dr = self.dr.__copy__()
        temp_dr.aggregation = self.time_series_aggregation_method
        get_raster_executor = GetRasterExecutor(
            dr=temp_dr,
        )
        raster = get_raster_executor.execute()
        self.log_info.append(get_raster_executor.get_log())

        dims = DATASET_GRID_DIMS[self.dr.dataset]
        if self.time_series_aggregation_method == "mean":
            return raster.mean(dim=[dims["y"], dims["x"]]).compute()
        elif self.time_series_aggregation_method == "max":
            return raster.max(dim=[dims["y"], dims["x"]]).compute()
        elif self.time_series_aggregation_method == "min":
            return raster.min(dim=[dims["y"], dims["x"]]).compute()
        else:
            raise ValueError(f"Invalid time series aggregation method: {self.time_series_aggregation_method}")
