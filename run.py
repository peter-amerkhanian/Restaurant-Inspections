from data_pipeline import to_geojson, to_csv, csv_file
import os

if os.path.exists(csv_file):
    to_geojson()
else:
    print("You don't have the restaurant data loaded. Do you want to load data now?")
    print("Note: This process can take up to 15 minutes...")