import os
import pandas as pd
from geopy.point import Point
import geojson
from typing import Iterator


csv_file: str = "data/restaurant_inspections_2012_2019.csv"
map_file: str = "data/restaurant_map.geojson"


def build_a_feature(df: pd.DataFrame) -> Iterator[geojson.Feature]:
    """Yield a geojson feature for each row in the given df"""
    for x in df.itertuples():
        geometry = geojson.Point((x.point.longitude, x.point.latitude))
        yield geojson.Feature(geometry=geometry,
                              properties={'doing_business_as': x.facility_name,
                                          'inspection_date': x.activity_date,
                                          'grade': x.resource_code if x.resource_code else "No Grade Recorded",
                                          'address': x.address,
                                          'violation_description': x.violation_description})

def to_geojson() -> None:
    """Converts the csv file of restaurant data into a geojson file"""
    df: pd.DataFrame = pd.read_csv(csv_file)
    df.drop(columns=[':@computed_region_q3a8_eiwf', 'Unnamed: 0', 'location_1'],
            inplace=True)
    print(df.point)
    df['point'] = df['point'].apply(
        lambda x: None if type(x) == float else Point(x))
    df.dropna(subset=['point'], inplace=True)
    df.fillna('', inplace=True)
    features: Iterator[geojson.Feature] = build_a_feature(df)
    feature_collection: geojson.FeatureCollection = geojson.FeatureCollection(list(features))
    with open(map_file, 'w', encoding='utf8') as f:
        geojson.dump(feature_collection,
                    f,
                    sort_keys=True,
                    ensure_ascii=False)
    print("geojson file created successfully.")
