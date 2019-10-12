from data_pipeline import to_geojson, to_csv, csv_file
import os

"""
TODO: Right now, the incorrect coords supplied by AC are removed.
These should instead be re-searched by the Open Map API
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
