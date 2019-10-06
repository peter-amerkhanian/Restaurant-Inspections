#%%
import os
import pandas as pd
from geopy.point import Point
import geojson

if os.path.exists("restaurant_inspections_2012_2019.csv"):
    df: pd.DataFrame = pd.read_csv("restaurant_inspections_2012_2019.csv")
    df.drop(columns=[':@computed_region_q3a8_eiwf', 'Unnamed: 0', 'location_1'],
            inplace=True)
    df['point'] = df['point'].apply(
        lambda x: None if type(x) == float else Point(x))
    print(df['point'].apply(lambda x: (x.latitude, x.longitude) if x else None))
else:
    print("You don't have the restaurant data loaded. Please use 'run.py' to create a csv of the data.")


#%%
