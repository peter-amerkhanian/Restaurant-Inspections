import os
import pandas as pd
from geopy.point import Point
import geojson


csv_file: str = "data/restaurant_inspections_2012_2019.csv"
map_file: str = "data/restaurant_map.geojson"

def build_a_feature(df: pd.DataFrame) -> geojson.Feature:
    return geojson.Feature(geometry=geojson.Point(df["point"]),
                           properties={'name': df["facility_name"]})


if os.path.exists(csv_file):
    df: pd.DataFrame = pd.read_csv(csv_file)
    df.drop(columns=[':@computed_region_q3a8_eiwf', 'Unnamed: 0', 'location_1'],
            inplace=True)
    df['point'] = df['point'].apply(
        lambda x: Point(0, 0) if type(x) == float else Point(x))
    features: pd.Series = df.apply(build_a_feature, axis=1)
    feature_collection: geojson.FeatureCollection = geojson.FeatureCollection(list(features))
    with open(map_file, 'w', encoding='utf8') as f:
        geojson.dump(feature_collection,
                     f,
                     sort_keys=True,
                     ensure_ascii=False)
else:
    print("You don't have the restaurant data loaded. Please use 'run.py' to create a csv of the data.")



