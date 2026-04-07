import os

from .utils.const import DataRange
from .metadata import add_metadata, remove_metadata, get_largest_files

_query_list: list[(DataRange, str, float)] = []
_total_storage_used_bytes = 0
_storage_limit_bytes: int

# TODO: Name's kind of misleading, this is acting more as a data manager?
def init_query_monitor(storageLimitGB: int):
    _storage_limit_bytes = storageLimitGB * 10e9

def update_storage_used(files: set[str]):
    global _total_storage_used_bytes
    _total_storage_used_bytes = 0
    for file in files:
        _total_storage_used_bytes = _total_storage_used_bytes + os.path.getsize(file)


def log_query(dr: DataRange, file: str, time: float) -> None:
    global _query_list

    _query_list.append(dr, file, time)
    # if len(_query_list) > 50:
    #     # Push to persistent storage?
    #     pass


def keep_file(dr: DataRange, file_path: str):
    """Preserves a downloaded file, adding it to metadata and treating it as if it's 
    in permanent storage.

    dr : The DataRange the file stores, so we can add it to the metadata
    file_path : The filepath to access the file
    """

    add_metadata(dr, file_path)
    _total_storage_used_bytes = _total_storage_used_bytes + os.path.getsize(file_path)

    if _total_storage_used_bytes > _storage_limit_bytes:
        _free_data(_total_storage_used_bytes - _storage_limit_bytes)

# Frees data until you have a certain amount free
def _free_data(storageBytes: int) -> None:
    # frees an amount of bytes based on "LRU"
    considered_files = get_largest_files()

    for tuple in _query_list[-50:]:
        if tuple[1] in considered_files:
            considered_files.remove(tuple[1])
    
    # TODO: Add largest considered_files to be deleted first (sort considered_files)
    for file in considered_files:
        if os.path.exists(file):
            storageBytes = storageBytes - os.path.getsize(file)
            _total_storage_used_bytes = _total_storage_used_bytes - os.path.getsize(file)
            os.remove(file)
            remove_metadata(file)

        if storageBytes <= 0:
            break