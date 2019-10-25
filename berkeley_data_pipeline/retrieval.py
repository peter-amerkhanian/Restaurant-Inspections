
import json
import pandas as pd
import requests
from typing import List

url: str = "https://data.cityofberkeley.info/resource/iuea-7eac.geojson"

def load_df(url: str) -> pd.DataFrame:
    js: dict = json.loads(requests.get(url).content)
    df: pd.DataFrame = pd.DataFrame(js['features'])
    properties: pd.DataFrame = pd.DataFrame(list(df['properties']))
    coordinates: pd.Series = df['geometry'].apply(
        lambda x: x.get('coordinates') if x else None
        )
    properties['coordinates'] = coordinates
    return properties

def agg_violations(df: pd.DataFrame, violation_type: str) -> pd.Series:
    columns: List[str] = []
    name: str
    for name in df.columns:
        if name.startswith(violation_type):
            columns.append(name)
    violation_sum: pd.Series = df[columns].apply(pd.to_numeric).sum(axis=1)
    return violation_sum

def build_df() -> pd.DataFrame:
    df: pd.DataFrame = load_df(url)
    df['major_sum'] = agg_violations(df, 'major')
    df['minor_sum'] = agg_violations(df, 'minor')
    df.to_csv("data/berkeley_restaurants.csv")
    return df
