#######################################
# Description:
#
#   for each row of file_info:
#       creates Aggregate class instance: Aggregate(file_name,dataset,variable,time_range,additional)
#       runs execute() function
#
# How to run script:
#
#   run in terminal
#
#       source venv/bin/activate
#       python test_aggregate.py
#
#######################################


from api.iharp_query_processor.src.utils.aggregate import Aggregate
import pandas as pd

file_info = pd.read_csv("/home/uribe055/django-react-starter/file_list.csv", sep=',', skipinitialspace=True, dtype=str)           

for idx, row in file_info.iterrows():

    agg_obj = Aggregate(row['file_name'], row['dataset'], row['variable'], row['time_range'], row['additional'])
    agg_obj.execute()
    print(f"file {row['file_name']} aggregations complete.\n")