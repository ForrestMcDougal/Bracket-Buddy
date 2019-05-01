import os
import pandas as pd

from sportsreference.ncaab.teams import Teams
from sportsreference.ncaab.schedule import Schedule

errors = []

for year in range(2010, 2020):
    year = str(year)
    print(year)
    for team in Teams(year=year):
        try:
            df = pd.DataFrame()
            index = 0
            schedule = Schedule(team.abbreviation, year=year)
            for game in schedule:
                temp_df = pd.DataFrame({'year': year,
                                        'arena': game.arena,
                                        'location': game.location,
                                        'team': team.abbreviation,
                                        'opponent': game.opponent_abbr,
                                        'team_points': game.points_for,
                                        'opponent_points': game.points_against},
                                       index=[index])
                df = pd.concat([df, temp_df], ignore_index=True)
                index += 1
            output_path = os.path.join('data', 'sportsreference_data',
                                       f'{year}_data',
                                       f'{team.abbreviation.lower()}.csv')
            df.to_csv(output_path)
        except Exception as e:
            print(e)
            print(year, team.abbreviation.lower())
            errors.append((year, team))

print('done')
print(errors)

master_df = pd.DataFrame()
index = 0
for year in range(2010, 2020):
    year = str(year)
    print(year)
    for team in Teams(year=year):
        path = os.path.join('data', 'sportsreference_data',
                            f'{year}_data',
                            f'{team.abbreviation.lower()}.csv')
        temp_df = pd.read_csv(path)
        for i, row in temp_df.iterrows():
            if row['location'] == 'Home':
                new_row = pd.DataFrame({'year': row['year'],
                                        'home': row['team'].lower(),
                                        'away': row['opponent'].lower(),
                                        'home_points': int(row['team_points']),
                                        'away_points': int(row['opponent_points']),
                                        'neutral': False}, index=[index])
            elif row['location'] == 'Away':
                new_row = pd.DataFrame({'year': row['year'],
                                        'home': row['opponent'].lower(),
                                        'away': row['team'].lower(),
                                        'home_points': int(row['opponent_points']),
                                        'away_points': int(row['team_points']),
                                        'neutral': False}, index=[index])
            else:
                if row['team_points'] > row['opponent_points']:
                    new_row = pd.DataFrame({'year': row['year'],
                                            'home': row['team'].lower(),
                                            'away': row['opponent'].lower(),
                                            'home_points': int(row['team_points']),
                                            'away_points': int(row['opponent_points']),
                                            'neutral': True}, index=[index])
                else:
                    new_row = pd.DataFrame({'year': row['year'],
                                            'home': row['opponent'].lower(),
                                            'away': row['team'].lower(),
                                            'home_points': int(row['opponent_points']),
                                            'away_points': int(row['team_points']),
                                            'neutral': True}, index=[index])
            index += 1
            master_df = pd.concat([master_df, new_row], ignore_index=True)

master_df = master_df.drop_duplicates()
output_path = os.path.join(
    'data', 'sportsreference_data', 'all_games.csv')
master_df.to_csv(output_path)
print('done')

master_df = pd.DataFrame()

for year in range(2010, 2020):
    year = str(year)
    print(year)
    df_path = os.path.join('data', 'cleaned', f'master_{year}.csv')
    df_year = pd.read_csv(df_path)
    df_pruned = df_year[['TeamName', 'Season', 'AdjTempo', 'AdjOE', 'AdjDE',                            'eFG_Pct_O', 'eFG_Pct_D',
                         'TO_Pct_O', 'TO_Pct_D', 'OR_Pct_O', 'OR_Pct_D', 'FT_Rate_O', 'FT_Rate_D',
                         'OFF_FT', 'OFF_2PT', 'OFF_3PT', 'DEF_FT', 'DEF_2PT', 'DEF_3PT', 'Size',
                         'Hgt1', 'Hgt2', 'Hgt3', 'Hgt4', 'Hgt5', 'HgtEff', 'Exp', 'Bench', 'Pts1', 'Pts2',
                         'Pts3', 'Pts4', 'Pts5', 'OR1', 'OR2', 'OR3', 'OR4', 'OR5', 'DR1', 'DR2', 'DR3', 'DR4',
                         'DR5', 'FG2Pct', 'FG3Pct', 'FTPct', 'BlockPct', 'OppFG2Pct', 'OppFG3Pct', 'OppFTPct',
                         'OppBlockPct', 'F3GRate', 'OppF3GRate', 'ARate', 'OppARate', 'StlRate', 'OppStlRate']]
    master_df = pd.concat([master_df, df_pruned], ignore_index=True)

output_path = os.path.join('data', 'cleaned', 'master_kenpom.csv')
master_df.to_csv(output_path)
