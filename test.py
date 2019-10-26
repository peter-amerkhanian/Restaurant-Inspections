from berkeley_data_pipeline import build_df
from berkeley_data_pipeline.df_to_geojson import df_to_geojson

df = build_df()
df_to_geojson(df)
