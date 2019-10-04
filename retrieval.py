import json
from typing import Optional, Tuple

import numpy as np
import pandas as pd
import requests
from geopy.point import Point

url: str = "https://data.acgov.org/resource/3d5b-2rnz.json"


def json_to_df(url: str) -> pd.DataFrame:
    """Makes a pandas df out of json from an api call"""
    json_data: bytes = json.loads(requests.get(url).content)
    return pd.DataFrame(json_data)


def get_lat_long(df: pd.DataFrame) -> list:
    """If the restaurant already has lat/long, get that data"""
    lat: pd.Series = df['location_1'].apply(lambda x: x.get('latitude'))
    long: pd.Series = df['location_1'].apply(lambda x: x.get('longitude'))
    return [Point(x, y) if (x and y) else None for x, y in zip(lat, long)]


def get_city(df: pd.DataFrame) -> pd.Series:
    """Get the city of a restaurant from its address"""
    cities: pd.Series = df['address'].apply(lambda x: x.split(', ')[0].split()[-1])
    return cities.apply(lambda x: x.replace("CITY", "UNION CITY").replace("LEANDRO", "SAN LEANDRO"))
