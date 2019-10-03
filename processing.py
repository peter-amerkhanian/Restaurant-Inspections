from typing import Any, Dict, Iterator, List, Optional

import geopy
import pandas as pd
from geopy.point import Point

geopy.geocoders.options.default_user_agent = "alameda county health"
gn = geopy.geocoders.Nominatim()


def call_geopy_api(address: Dict[str, str]) -> Optional[geopy.location.Location]:
    """Utility: Returns the longitude and latitude of a given site"""
    try:
        coordinates = gn.geocode(address)
        return coordinates
    except geopy.exc.GeocoderTimedOut:
        print(f"No Coordinates Found For: {address['street']} {address['city']}")
        return None
    except geopy.exc.GeocoderServiceError:
        print(f"No Coordinates Found For: {address['street']} {address['city']}")
        return None


def gen_coordinates(df: pd.DataFrame) -> Iterator[Optional[Point]]:
    """Step 1: Generate coordinates, one for each restaurant."""
    for index, row in df.iterrows():
        if index % 100 == 0:
            print("{}% complete...".format(int(100*(index / len(df.index)))))
        if row['point']:
            yield None
        else:
            x = row['address'].split(f"{row['city']}, ")
            street = x[0]
            city = row['city']
            state = x[1].split()[0]
            postalcode = x[1].split()[1]
            coord = call_geopy_api({'street': street,
                                    'city': city,
                                    'state': state,
                                    'postalcode': postalcode})
            if coord:
                yield coord.point
            else:
                yield None


def gen_integrated_coordinates(coords: Iterator[Optional[Point]], df: pd.DataFrame) -> Iterator[Optional[Point]]:
    """Step 2: Generate Point data that is either already in the df or was retrieved with gen_coordinates."""
    for df_c, c in zip(df.point, coords):
        if df_c:
            yield df_c
        elif c:
            yield c
        else:
            yield None


def build_integrated_coordinate_series(df: pd.DataFrame) -> pd.Series:
    print("Running coordinate retrieval.")
    coordinates = gen_coordinates(df)
    integrated_coordinates = gen_integrated_coordinates(coordinates, df)
    series = pd.Series(list(integrated_coordinates))
    nans = series.isna().sum()
    print("100% complete... Resulting NaN values: {}".format(nans))
    return series
