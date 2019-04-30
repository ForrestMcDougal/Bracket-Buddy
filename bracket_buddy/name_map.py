import os
import pandas as pd

input_path = os.path.join('data', 'ml_data', 'sref_kenpom_map.csv')
name_map_df = pd.read_csv(input_path)

name_map = dict()

for i, row in name_map_df.iterrows():
    name_map[row['sportsref']] = row['KenPom']
