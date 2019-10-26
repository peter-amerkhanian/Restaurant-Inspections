from typing import Iterator
import pandas as pd
import geojson
from .retrieval import build_df
from typing import Tuple

map_file: str = "data/berkeley_restaurant_map.geojson"
df = build_df()


def build_a_feature(df: pd.DataFrame) -> Iterator[geojson.Feature]:
    """Yield a geojson feature for each row in the given df"""
    for x in df.itertuples(): # x: tuple
        if x.coordinates:
            geometry = geojson.Point((x.coordinates))
            yield geojson.Feature(geometry=geometry,
                                properties={'doing_business_as': x.doing_business_as,
                                            'inspection_date': x.inspection_date,
                                            'address': x.restaurant_address_address,
                                            'major_violations': x.major_sum,
                                            'minor_violations': x.minor_sum})

def df_to_geojson(df: pd.DataFrame) -> None:
    features: Iterator[geojson.Feature] = build_a_feature(df)
    feature_collection: geojson.FeatureCollection = geojson.FeatureCollection(list(features))
    with open(map_file, 'w', encoding='utf8') as f:
            geojson.dump(feature_collection,
                        f,
                        sort_keys=True,
                        ensure_ascii=False)
    print(feature_collection)
