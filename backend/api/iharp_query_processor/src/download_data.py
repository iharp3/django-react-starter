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

dataset = "carra"
variables = ["temperature", "pressure"] # , "wind_direction", "wind_speed"]
years = ["2020", "2021", "2022", "2023", "2024"]
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
height_levels = ["30_m"]#["15_m",
                # "30_m",
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

all_files = []
file_list = "/home/uribe055/django-react-starter/file_list.txt"

for year in years:  # 5
    for variable in variables:  # 10
        print(f"Varable: {variable}")
        for domain in domains:  # 20
            print(f"\tDomain: {domain}")
            for height_level in height_levels:  # 40
                print(f"\t\tHeight levels: {height_level}")
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
                
                print(f"\n\n\t\t....requesting:")
                driver = RequestRemoteData.from_dict(params)
                result = driver.execute()

                print("\nDriver result:")
                print("Success:", result.success)
                print("Files:", result.files)
                print("Error:", result.error)
                print("#####\t######\t ####\t####\t####\t####\t #####\t######\n")
                print("#####\t######\t ####\t####\t####\t####\t #####\t######\n")

                if not result.success:
                    raise RuntimeError(result.error)
                
                time_range = f"{year}_height{height_level}_domain{domain}"
                
                try:
                    all_files.append([result.files, dataset, variable, time_range])
                except Exception as e:
                    print(f"Could not append {result.files}, {dataset}, {variable}, {time_range} to text file")

                print(f"\n\n\n")
    
        try:
            with open(file_list, 'w') as file:
                # Join list elements into a single string with newline characters (\n)
                data_to_write = '\n'.join(all_files)
                file.write(data_to_write)
        except Exception as e:
            print(f"Could not write list of downloaded files:")
            for f in all_files:
                print(f)
            continue