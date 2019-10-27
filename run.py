import os

import pandas as pd

import ac_data_pipeline
import berkeley_data_pipeline

"""
TODO: Add more information to each feature on the map
"""

if os.path.exists(ac_data_pipeline.csv_file):
    ac_data_pipeline.to_geojson()
    berkeley_data_pipeline.to_geojson()
else:
    print("You don't have the restaurant data loaded. Do you want to load data now?")
    print("Note: This process can take up to 15 minutes...")
    answer = input("Y/N: ")
    if answer.lower() == "y":
        ac_data_pipeline.to_csv()
        print("CSV created, now creating geojson")
        ac_data_pipeline.to_geojson()
    else:
        print("goodbye.")
