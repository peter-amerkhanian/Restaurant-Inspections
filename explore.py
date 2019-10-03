#%%
import pandas as pd
from geopy.point import Point


df: pd.DataFrame = pd.read_csv("restaurant_inspections_2012_2019.csv")
df.drop(columns=[':@computed_region_q3a8_eiwf', 'Unnamed: 0', 'location_1'],
        inplace=True)
df['point'] = df['point'].apply(
    lambda x: None if type(x) == float else Point(x))


#%%
