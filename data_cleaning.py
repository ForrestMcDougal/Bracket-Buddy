import os

import pandas as pd
import pymongo

years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]

for year in years:
    short_year = year - 2000
    summary = os.path.join('data', 'SeasonSummary',
                           f'summary{short_year}_pt.csv')
    summary_df = pd.read_csv(summary)
    summary_df = summary_df.set_index('TeamName')
    ff_offense = os.path.join('data', 'FourFactors',
                              'Offense', f'offense{short_year}.csv')
    ff_o_df = pd.read_csv(ff_offense)
    ff_o_df = ff_o_df.set_index('TeamName')
    ff_o_df = ff_o_df.drop(columns=['Season'])
    ff_defense = os.path.join('data', 'FourFactors',
                              'Defense', f'defense{short_year}.csv')
    ff_d_df = pd.read_csv(ff_defense)
    ff_d_df = ff_d_df.set_index('TeamName')
    ff_d_df = ff_d_df.drop(columns=['Season'])
    team_points = os.path.join(
        'data', 'PointDist', f'pointdist{short_year}.csv')
    points_df = pd.read_csv(team_points)
    if year != 2016:
        points_df.columns = ['Season', 'TeamName', 'OFF_FT', 'OFF_FT_Rank', 'OFF_2PT', 'OFF_2PT_Rank', 'OFF_3PT',
                             'OFF_3PT_Rank', 'DEF_FT', 'DEF_FT_Rank', 'DEF_2PT', 'DEF_2PT_Rank', 'DEF_3PT', 'DEF_3PT_Rank']
    else:
        points_df = points_df.reset_index()
        points_df.columns = ['Season', 'TeamName', 'OFF_FT', 'OFF_FT_Rank', 'OFF_2PT', 'OFF_2PT_Rank', 'OFF_3PT',
                             'OFF_3PT_Rank', 'DEF_FT', 'DEF_FT_Rank', 'DEF_2PT', 'DEF_2PT_Rank', 'DEF_3PT', 'DEF_3PT_Rank', 'not_used']
        points_df = points_df.drop(columns=['not_used'])
    points_df = points_df.set_index('TeamName')
    points_df = points_df.drop(columns=['Season'])
    height_exp = os.path.join('data', 'HeightExpData',
                              f'height{short_year}.csv')
    height_df = pd.read_csv(height_exp)
    height_df = height_df.set_index('TeamName')
    height_df = height_df.drop(columns=['Season'])
    misc = os.path.join('data', 'MiscellaneousData', f'misc{short_year}.csv')
    misc_df = pd.read_csv(misc)
    misc_df = misc_df.set_index('TeamName')
    misc_df = misc_df.drop(columns=['Season'])
    ff_df = ff_o_df.merge(ff_d_df, left_index=True,
                          right_index=True, suffixes=('_O', '_D'))
    master_df = summary_df.merge(ff_df, right_index=True, left_index=True)
    master_df = master_df.merge(points_df, right_index=True, left_index=True)
    master_df = master_df.merge(height_df, right_index=True, left_index=True)
    master_df = master_df.merge(misc_df, right_index=True, left_index=True)
    output_path = os.path.join('data', 'cleaned', f'master_{year}.csv')
    master_df.to_csv(output_path)
