#######################################
# How to run file:
#
#   edit the data range/parameters if you want
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
variables = ["temperature", "pressure", "wind_direction", "wind_speed"]
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
height_levels = ["15_m",
                "30_m",
                "50_m"]
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
t_out = "/home/uribe055/django-react-starter/terminal_out.txt"
file_list = "/home/uribe055/django-react-starter/file_list.txt"

for year in years:
    for variable in variables:
        print(f"Varable: {variable}")
        for domain in domains:
            print(f"\tDomain: {domain}")
            for height_level in height_levels:
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
                print("###########\t ##############\t ###########\n")
                print("###########\t ##############\t ###########\n")

                if not result.success:
                    raise RuntimeError(result.error)
                
                all_files.append(result.files)

                with open(t_out, 'w') as file:
                    # Join list elements into a single string with newline characters (\n)
                    data_to_write = '\n'.join(result)
                    file.write(data_to_write)

                print(f"\n\n\n")
    
        with open(file_list, 'w') as file:
            # Join list elements into a single string with newline characters (\n)
            data_to_write = '\n'.join(all_files)
            file.write(data_to_write)