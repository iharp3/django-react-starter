# iharp-query-processor


### Outline

1. [Description of files](#description-of-iharp-query-processor-directory-files)
2. [How queries are processed](#how-queries-are-processed)
    * [Queries](#queries)
    * [Data request](#data-request)
    * [Data download](#data-download)
    * [Data aggregation](#data-aggregation)
3. [How data is stored](#how-data-is-indexed-and-stored)
4. [How to...](#how-to)
5. [TODO](#todo)

## Description of iharp-query-processor directory files

### `metadata.py`

Below is the outline of the query processing files.

    src/ 
    ├── remote/ 
    |   ├── base.py 
    |   ├── carra.py 
    |   ├── driver.py 
    |   ├── era5.py 
    |   ├── models.py 
    ├── utils/ 
    |   ├── aggregate.py
    |   ├── const.py 
    |   ├── get_whole_period.py 
    ├── download_data.py
    ├── metadata.py 
    ├── query_executor_find_time.py 
    ├── query_raster.py 
    ├── query_executor_timeseries.py 
    ├── query_executor.py 
    ├── test_qe_get_raster.py

## How queries are processed

### Queries

To answer a query, the backend does the following:

1. Load the metadata of the variable of interest specified in the requested data $R$.
2. Find the data in storage that matches $R$, if any.
    * if all of $R$ is in storage, continue to execute query
    * if part of $R$ is not in storage:
        * Compute missing data ranges
        * Download missing ranges
        * Update metadata/files
3. Execute query: 
    * Open all files (lazily) that make up $R$
    * Slice query to get desired data
    * Compute result

As we execute the query, we must keep track of the files we open and look through to update our statistics and determine which files are candidates to be replaced if we run out of storage space.

### Data request

The initial data request is provided by the local storage owner as a csv file with the dataset, variable, time and spatial range, and resolution they are interested in.
* Any other dataset-specific or variable-specific information must be provided
* The time period should be continuous in each row of the csv
* The spatial range should be continuous in each row of the csv
* The resolutions should be the *finest* resolution that is expected to be queried often.

### Data download
Data is downloaded when the local storage does not have the requested data $R$ needed to answer a query. We determine if this is the case in `query_executor_get_raster.py`. We find all the local files that have data $L \subset R$ and if $R - L \neq \empty$, we call the `remote/driver.py` file that creates an instance of the `RequestRemoteData` class, and handles the request and download of the desired data.

Data download can also be done as a batch (for populating the local storage etc.) using the `download_data.py` script. This script has hard-coded parameters that are the inputs to the `RequestRemoteData` class, and it runs them.


### Data aggregation
NOT IMPLEMENTED: 

When data is downloaded, we will keep it as it is the most recently used. Thus, we need to index it by creating the incomplete partial pyramid hiearchy for this file/edit the corresponding incomplete partial pyramid hierarchy. 

Ideally, we can start the data aggregation process when no query is being run.

IMPLEMENTED:

`aggregate.py` takes in a file name and aggregates it by time and space (described more in `utils/README.md`).


## How data is indexed and stored

IMPLEMENTED: 

**index values using resolutions**

For each downloaded file, we aggregate the values by time and space as follows: 

Let $t_r, s_r$ be the temporal and spatial resolution respectively of the downloaded file. We will aggregate in the time dimension to: \{day, month, year\} values. Then we aggregate each of these files (and the original downloaded file) in the space dimension by coarsening the resolution to $2s_r$ and $4s_r$. These coarser resolutions give us a coarser grid/time range to check values against for a query.

**index dimensions**

We keep a `metadata.csv` file in a repository `/data/` that keeps the following information for each file we have in local storage:

        variable, start_datetime, end_datetime, max_lat, min_lat, min_lon, max_lon, temporal_resolution, spatial_resolution, aggregation, file_path

In summary, we keep the variable, time range, spatial range, time and space resolutions, the type of aggregation, and the file it belongs to.

**storage**

Data is stored in files. Each file only stores one variable. The time and spatial ranges vary between files. That information is stored in the `metadata.csv` file. However, both the time and spatial range are continuous, so for example, a variable covering time ranges $[2010,2015]\cup[2020-2025]$ will be split up into two files. 

---
NOT IMPLEMENTED:

**Outline:**

For each variable in each dataset, we can keep a "metadata" file containing the summary of the metadata of that variable:

        start_datetime, end_datetime, max_lat, min_lat, min_lon, max_lon

This file has no resolutions because if we have data, even if the resolution is too coarse, we will still try to answer the query before downloading the data. We will also keep a separate `files.csv` that keeps the file-specific information:

        start_datetime, end_datetime, max_lat, min_lat, min_lon, max_lon, last_access, temporal_resolution, spatial_resolution

This way, we don't have to look through the files of all the datasets and can go straight to the files of interest. Our storage would have the following structure:

        /data/
            {dataset}_{variable}.csv            <-- one metadata file for each dataset/variable pair
            ...
            {dataset}_{variable}_files.csv      <-- file-specific information

            {dataset}/                          <-- directory for each dataset just for clarity
                file1.nc
                file2.nc
                ...

            {dataset}/
                file1.nc
                file2.nc

## How to...


## TODO
* Change `download_data.py` parameters from hard-code to arguments passed when you call download data...maybe pass in as a text file?
* limit the size of data download request or divide it up and give message about it
* check if online data request and download are done in a tmux session/make it go in a different session than the main polaris so if it fails the whole system doesn't fail
* change storage structure and metadata.