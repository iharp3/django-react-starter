# Utils

### Outline
* Description of files:
    * [aggregate.py](#description-of-aggrregatepy)
    * [const.py](#description-of--constpy)
    * [get_whole_period.py](#description-of-get_whole_periodpy)
* [How to update](#how-to-)
* [TODO](#todo)

### Description of `aggrregate.py`

The class `Aggregate` calls functions `time_driver` and `space_driver`.

`time_driver` takes in the file of downloaded data, and resamples it into day, month, and year temporal resolutions. 

`space_driver` takes in the file of downloaded data, resamples it into two coarser spatial resolutions (2 times coarsened from the original, and 4 times coarsened from the original), and does the same thing with the files that `time_driver` created (it assumes the files have a certain name convention to read them in).

### Description of  `const.py`

### Description of `get_whole_period.py`

### How to ...


### TODO
* Check functions in `get_whole_period.py`
* Delete print statemnts in `get_whole_period.py`
* Add "hour" aggregation for smaller than one hour time sampling in `aggregate.py`
* Figure out carra ranges for lat/lon for get_lat_lon_range function to use (`const.py`)