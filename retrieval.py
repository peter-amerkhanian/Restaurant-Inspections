import json
import requests
import pandas as pd
import requests
import numpy as np
from typing import Optional, Tuple
from geopy.point import Point

url = "https://data.acgov.org/resource/3d5b-2rnz.json"


def json_to_df(url: str) -> pd.DataFrame:
    """Makes a pandas df out of json from an api call"""
    json_data = json.loads(requests.get(url).content)
    return pd.DataFrame(json_data)


def get_lat_long(df: pd.DataFrame) -> list:
    """If the restaurant already has lat/long, get that data"""
    lat = df['location_1'].apply(lambda x: x.get('latitude'))
    long = df['location_1'].apply(lambda x: x.get('longitude'))
    return [Point(x, y) if (x and y) else None for x, y in zip(lat, long)]
