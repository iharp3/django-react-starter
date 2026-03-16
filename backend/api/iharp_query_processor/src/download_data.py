#######################################
# How to run file:
#
#   edit the data range/parameters if you want for:
#       dataset, variables, time (y,m,d), space (region, lat/lon), height levels
# 
#   run in terminal
#
#       source venv/bin/activate
#       cd /../iharp_query_processor
#       python -m src.download_data
#
#######################################

from src.remote.driver import RequestRemoteData
import csv

dataset = "carra"
variables = ["temperature", "pressure"] # , "wind_direction", "wind_speed"]
years = ["2021"]
months = ["01", "02", "03","04", "05", "06","07", "08", "09","10", "11", "12"]
days = ["01", "02", "03",
        "04", "05", "06",
        "07", "08", "09",
        "10", "11", "12",
        "13", "14", "15",
        "16", "17", "18",
        "19", "20", "21",
        "22", "23", "24",
        "25", "26", "27",
        "28", "29", "30",
        "31"]
domains = ["east_domain", "west_domain"]
height_levels = ["15_m",
                "30_m"]
                # "50_m"]
                # "75_m",
                # "100_m",
                # "150_m",
                # "200_m",
                # "250_m",
                # "300_m",
                # "400_m",
                # "500_m"]
min_lat = None
max_lat = None
min_lon = None
max_lon = None

file_list = "/home/uribe055/django-react-starter/file_list.csv"

with open(file_list, "a", newline="") as f:
    writer = csv.writer(f)

    for year in years:  # 5 years (2020-2024)
        for variable in variables:  # 2 vars -> 10 files
            for domain in domains:  # 2 domains -> 20 files
                for height_level in height_levels:  # 2 levels -> 40 files, at 3.52 GB each = 140.8 GB (check pressure file size)
                    params = {"dataset": dataset,
                            "variable": variable,
                            "years": [year],
                            "months": months,
                            "days": days,
                            "domain": domain,
                            "height_level": height_level,
                            "min_lat": min_lat,
                            "max_lat": max_lat,
                            "min_lon": min_lon,
                            "max_lon": max_lon,
                    }
                    try:
                        driver = RequestRemoteData.from_dict(params)
                        result = driver.execute()
                    except Exception as e:
                        print(f"Error from RequestRemoteData: \n\n {e}")
                        pass
                    time_range = f"{year}_height{height_level}_{domain}"
                    try:
                        writer.writerow([result.files, dataset, variable, time_range])
                        f.flush()
                    except Exception as e:
                        writer.writerow([result.files, dataset, variable, time_range, "Error", str(e)])
                        f.flush()

                    print(f"\n###\t###\t###\t###\t###\t###\t###\t###\t###\t###\t###\t###\t###\t###\t###\n")