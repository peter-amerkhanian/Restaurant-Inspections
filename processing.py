from typing import Dict, Iterator, List, Optional

import geopy
import pandas as pd
from geopy.point import Point

geopy.geocoders.options.default_user_agent = "alameda county health"
gn = geopy.geocoders.Nominatim()


def call_geopy_api(address: Dict[str, str]) -> Optional[geopy.location.Location]:
    """Utility: Returns the longitude and latitude of a given site"""
    try:
        coordinates: geopy.location.Location = gn.geocode(address)
        if coordinates:
            if coordinates.latitude > 38 or coordinates.latitude < 37:
                print(f"Latitiude outside of target area: ({coordinates.point.latitude}, {coordinates.point.longitude})")
                return None
            if coordinates.longitude > -121 or coordinates.longitude < -123:
                print(f"Longitude outside of target area: ({coordinates.point.latitude}, {coordinates.point.longitude})")
                return None
        return coordinates
    except geopy.exc.GeocoderTimedOut:
        print(
            f"No Coordinates Found For: {address['street']} {address['city']}")
        return None
    except geopy.exc.GeocoderServiceError:
        print(
            f"No Coordinates Found For: {address['street']} {address['city']}")
        return None


def gen_coordinates(df: pd.DataFrame) -> Iterator[Optional[Point]]:
    """Step 1: Generate coordinates, one for each restaurant."""
    for index, row in df.iterrows():
        if index % 100 == 0:
            print("{}% complete...".format(int(100*(index / len(df.index)))))
        if row['point']:
            yield None
        else:
            x: List[str] = row['address'].split(f"{row['city']}, ")
            street: str = x[0]
            city: str = row['city']
            state: str = x[1].split()[0]
            postalcode: str = x[1].split()[1]
            coord: geopy.location.Location = call_geopy_api({'street': street,
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
    """Runs gen_coordinates() then gen_integrated_coordinates()"""
    print("Running coordinate retrieval.")
    coordinates = gen_coordinates(df)
    integrated_coordinates = gen_integrated_coordinates(coordinates, df)
    series = pd.Series(list(integrated_coordinates))
    nans = series.isna().sum()
    print("100% complete... Resulting NaN values: {}".format(nans))
    return series
