from datetime import datetime
import pandas as pd

from retrieval import get_city, get_lat_long, json_to_df, url
from processing import gen_coordinates, gen_integrated_coordinates, build_integrated_coordinate_series

def main() -> None:
    df: pd.DataFrame = json_to_df(url)
    df = df.head(100) # testing
    # initial changes to the df
    df['activity_date'] = df['activity_date'].apply(
        lambda x: datetime.strptime(x.split('T')[0], "%Y-%m-%d"))
    df['point'] = get_lat_long(df)
    df['resource_code'] = df['resource_code'].apply(lambda x: x.lower())
    df['address'] = df['address'].apply(lambda x: x.upper())
    df['city'] = get_city(df)
    # filling in longitude and latitude for each restaurant
    nans: int = len(df.index)
    count: int = 0
    while True:
        count += 1
        print("Round {}".format(count))
        coord_series: pd.Series = build_integrated_coordinate_series(df)
        df['point'] = pd.Series(gen_integrated_coordinates(coord_series, df))
        new_nans: int = coord_series.isna().sum()
        if new_nans == nans:
            break
        else:
            nans = new_nans
        print("\n")
    print("Dataframe updated. {} NaN values in the Points columns.".format(nans))
    # df.to_csv("data/restaurant_inspections_2012_2019.csv")

if __name__ == "__main__":
    main()

