import os
import pandas as pd

from name_map import name_map, home_court

all_games_path = os.path.join('data', 'sportsreference_data', 'all_games.csv')
all_games_df = pd.read_csv(all_games_path)

kenpom_path = os.path.join('data', 'cleaned', 'master_kenpom.csv')
kenpom_df = pd.read_csv(kenpom_path)

output_df = pd.DataFrame()

for i, row in all_games_df.iterrows():
    if i % 100 == 0:
        print(i)
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
            data_columns[f'h_{col}'] = [home_kenpom.loc[:, col].values[0]]
        for col in away_kenpom.columns:
            data_columns[f'a_{col}'] = [away_kenpom.loc[:, col].values[0]]
        data_columns['hca'] = [hca]
        data_columns['home_points'] = [row['home_points']]
        data_columns['away_points'] = [row['away_points']]
        output_df = output_df.append(pd.DataFrame.from_dict(data_columns),
                                     ignore_index=True, sort=False)
    except:
        pass

output_path = os.path.join('data', 'ml_data', 'model_data.csv')
output_df.to_csv(output_path)
