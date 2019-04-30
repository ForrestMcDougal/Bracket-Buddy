import os
import pandas as pd

from name_map import name_map, home_court

all_games_path = os.path.join('data', 'sportsreference_data', 'all_games.csv')
all_games_df = pd.read_csv(all_games_path)

kenpom_path = os.path.join('data', 'cleaned', 'master_kenpom.csv')
kenpom_df = pd.read_csv(kenpom_path)

data_columns = {}
for col in kenpom_df.columns:
    data_columns[f'h_{col}'] = []
for col in kenpom_df.columns:
    data_columns[f'a_{col}'] = []
data_columns['hca'] = []
data_columns['home_points'] = []
data_columns['away_points'] = []

for i, row in all_games_df.iterrows():
    try:
        home_team = name_map[row['home']]
        away_team = name_map[row['away']]
        if row['neutral'] == True:
            hca = 0
        else:
            hca = home_court[home_team]
        temp_df = kenpom_df.loc[kenpom_df.Season == row['year']]
        home_kenpom = temp_df.loc[temp_df.TeamName == home_team]
        away_kenpom = temp_df.loc[temp_df.TeamName == away_team]
        data_columns = {}
        for col in home_kenpom.columns:
            data_columns[f'h_{col}'].append(home_kenpom[col])
        for col in away_kenpom.columns:
            data_columns[f'a_{col}'].append(away_kenpom[col])
        data_columns['hca'].append(hca)
        data_columns['home_points'].append(row['home_points'])
        data_columns['away_points'].append(row['away_points'])
        if i % 100 == 0:
            print(i)
    except:
        pass

output_df = pd.DataFrame(data_columns)
output_path = os.path.join('data', 'ml_data', 'model_data.csv')
output_df.to_csv(output_path)
