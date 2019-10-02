from datetime import datetime
from retrieval import json_to_df, get_lat_long, url


df = json_to_df(url)
df['activity_date'] = df['activity_date'].apply(lambda x: datetime.strptime(x.split('T')[0], "%Y-%m-%d"))
df['point'] = get_lat_long(df)
df['resource_code'] = df['resource_code'].apply(lambda x: x.lower())
df['address'] = df['address'].apply(lambda x: x.upper())
df['city'] = df['address'].apply(lambda x: x.split(', ')[0].split()[-1])
df['city'] = df['city'].apply(lambda x: x.replace("CITY", "UNION CITY").replace("LEANDRO", "SAN LEANDRO"))
