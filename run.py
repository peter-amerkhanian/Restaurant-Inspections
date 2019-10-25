from ac_data_pipeline import to_geojson, to_csv, csv_file
import os

"""
TODO: Add more information to each feature on the map
"""

if os.path.exists(csv_file):
    to_geojson()
else:
    print("You don't have the restaurant data loaded. Do you want to load data now?")
    print("Note: This process can take up to 15 minutes...")
    answer = input("Y/N: ")
    if answer.lower() == "y":
        to_csv()
        print("CSV created, now creating geojson")
        to_geojson()
    else:
        print("goodbye.")
