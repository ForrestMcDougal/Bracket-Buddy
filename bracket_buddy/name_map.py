import os
import pandas as pd

input_path = os.path.join('bracket_buddy', 'team_data', 'sref_kenpom_map.csv')
name_map_df = pd.read_csv(input_path)

name_map = dict()

for _, row in name_map_df.iterrows():
    name_map[row['sportsref']] = row['KenPom']

home_court_path = os.path.join('bracket_buddy', 'team_data', 'HomeCourtData.xlsx')
home_court_df = pd.read_excel(home_court_path)

home_court = dict()

for _, row in home_court_df.iterrows():
    home_court[row['Team']] = row['HCA']
