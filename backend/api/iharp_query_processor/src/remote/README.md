# Handling Remote Data Requests

### Outline

1. A query calls `query_executor_get_raster.py` with the data it needs.
2. We check if the needed data is in local storage. If some subset of the data is in storage, we get the relevant file names.
3. If some subset of the data is missing, we:
    * Determine the range of data we need to download,
    * Call the `RequestRemoteData` driver to generate remote API requests, request and download the data, and return the downloaded file names.
4. Join all the relevant files into one dataset
5. Return the needed data.

### Description of remote directory files

        src/
        ├──...
        ├── query_executor_get_raster.py
        │
        ├── remote/
        │   ├── driver.py
        │   ├── models.py
        │   ├── base.py
        │   ├── era5.py
        │   ├── carra.py
        │

* **`models.py`** defines request and result objects
* **`base.py`** is the repository interface
* **dataset python files** generate API requests for the specific dataset
    * `era5.py`
    * `carra.py`
* **`driver.py`** handles the request, calls correct repository to download data (supports dict and toml input)

### How to add a new dataset
1. Create a python file for the dataset and store it in the `/src/remote/` directory

2. Register the dataset in the driver (`driver.py`) by 

    * adding `from src.remote.newdataset import NewDatasetRepository` to the imports 
    * the following code to the `_get_repository` function:

            if dataset == "newdataset":
                return NewDataset(self.config)

3. Add any additional variable inputs this dataset needs to the `DataRange` class in `/src/utils/const.py`, e.g.,

            <new input name> : Optional[<input type>] = None
    
    and as a parameter in the `long_short_name_dict`

            <new input name> : <new input name or short form used by remote repository>

4. Add the additional variables to the `request_params` dictionary in the function `_data_files_for_query()` in `query_executor_get_raster.py`.

            if self.dr.<new input name> is not None:
                request_params["<new input name>"] = self.dr.<new input name>





### TODO
* standardize downloaded datasets before returning them to the `query_executor_get_raster.py` OR make query executor more general.
    * write function to turn lat/lon info into East or West domain for CARRA dataset
    * standardize time and lat/lon variable names (e.g.):

            time_dim = "valid_time" if "valid_time" in ds.coords else "time"
            lat_dim = "latitude" if "latitude" in ds.coords else "lat"
            lon_dim = "longitude" if "longitude" in ds.coords else "lon"

            ds = ds.sel(
                {time_dim: slice(self.dr.start_datetime, self.dr.end_datetime),
                lat_dim: slice(self.dr.max_lat, self.dr.min_lat),
                lon_dim: slice(self.dr.min_lon, self.dr.max_lon)}
            )
* allow multiple data regions/ranges to be needed for a query (so we do not have to just query one continuous region and time range).
* automatically split large DataRanges into optimal ECMWF-sized chunks (or other remote repo) so downloads are fast and stable
    * edit the time range generator?
    * add max size values to each dataset class and split data into various _get_repository/download calls to be within the size
* make toml method an option to pass dict to `driver.py`:

            write_toml_config("request.toml", config_dict)
            # driver = RequestRemoteData.from_toml("request.toml")
