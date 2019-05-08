import os
import random

import numpy as np
import pandas as pd
import tensorflow as tf
from keras.backend import clear_session
from keras.models import load_model
from KDEpy import FFTKDE

from bracket_buddy.ml_data_stats import mean as ml_stats_mean, std as ml_stats_std
from bracket_buddy.year_team_std import year_team_std
from bracket_buddy.name_map import home_court
import bracket_buddy.ml_data_stats

clear_session()
model_path = os.path.join('bracket_buddy', 'production_model.h5')
model = load_model(model_path)
graph = tf.get_default_graph()

# columns to grab from database for prediction
cols = ['AdjTempo', 'AdjOE', 'AdjDE', 'eFG_Pct_O', 'eFG_Pct_D',
        'TO_Pct_O', 'TO_Pct_D', 'OR_Pct_O', 'OR_Pct_D', 'FT_Rate_O',
        'FT_Rate_D', 'OFF_FT', 'OFF_2PT', 'OFF_3PT', 'DEF_FT',
        'DEF_2PT', 'DEF_3PT', 'Size', 'Hgt1', 'Hgt2', 'Hgt3', 'Hgt4',
        'Hgt5', 'HgtEff', 'Exp', 'Bench', 'Pts1', 'Pts2', 'Pts3', 'Pts4',
        'Pts5', 'OR1', 'OR2', 'OR3', 'OR4', 'OR5', 'DR1', 'DR2', 'DR3',
        'DR4', 'DR5', 'FG2Pct', 'FG3Pct', 'FTPct', 'BlockPct',
        'OppFG2Pct', 'OppFG3Pct', 'OppFTPct', 'OppBlockPct', 'F3GRate',
        'OppF3GRate', 'ARate', 'OppARate', 'StlRate', 'OppStlRate']


def get_random_number():
    """generate random number between -1 and 1."""
    rand = random.random()
    rand = (rand * 2) - 1
    return rand


def prepare_data(year1, team1, year2, team2, mongo):
    """Prepare data for prediction."""
    data = []
    team_year_info = mongo.db.basketball.find_one(
        {'TeamName': str(team1), 'Season': int(year1)})
    for col in cols:
        data.append(team_year_info[col])
    tc1 = team_year_info['color1']
    team_year_info = mongo.db.basketball.find_one(
        {'TeamName': str(team2), 'Season': int(year2)})
    for col in cols:
        data.append(team_year_info[col])
    tc2 = team_year_info['color1']
    data.append(home_court.get(str(team1), 0))
    data = np.array(data)
    return data, tc1, tc2


def randomize_data(year1, team1, year2, team2, data):
    """randomize data for bootstrap predictions."""
    data_std = year_team_std[year1].get(team1, year_team_std['all'])
    cols_len = len(cols)
    data_copy = data.copy()
    data_copy[0] += get_random_number() * data_std['Pace']
    data_copy[1] += get_random_number() * data_std['ORtg']
    data_copy[2] += get_random_number() * data_std['DRtg']
    data_copy[3] += get_random_number() * data_std['OeFG%'] * 100
    data_copy[4] += get_random_number() * data_std['DeFG%'] * 100
    data_copy[5] += get_random_number() * data_std['OTOV%']
    data_copy[6] += get_random_number() * data_std['DTOV%']
    data_copy[7] += get_random_number() * data_std['OORB%']
    data_copy[8] += get_random_number() * data_std['DDRB%']
    data_copy[9] += get_random_number() * data_std['OFT/FGA'] * 100
    data_copy[10] += get_random_number() * data_std['DFT/FGA'] * 100
    data_copy[42] += get_random_number() * data_std['h3P%'] * 100
    data_copy[43] += get_random_number() * data_std['hFT%'] * 100
    data_copy[44] += get_random_number() * data_std['BLK%']
    data_copy[51] += get_random_number() * data_std['AST%']
    data_copy[53] += get_random_number() * data_std['STL%'] / 100
    data_std = year_team_std[year2].get(team2, year_team_std['all'])
    data_copy[0 + cols_len] += get_random_number() * data_std['Pace']
    data_copy[1 + cols_len] += get_random_number() * data_std['ORtg']
    data_copy[2 + cols_len] += get_random_number() * data_std['DRtg']
    data_copy[3 + cols_len] += get_random_number() * data_std['OeFG%'] * 100
    data_copy[4 + cols_len] += get_random_number() * data_std['DeFG%'] * 100
    data_copy[5 + cols_len] += get_random_number() * data_std['OTOV%']
    data_copy[6 + cols_len] += get_random_number() * data_std['DTOV%']
    data_copy[7 + cols_len] += get_random_number() * data_std['OORB%']
    data_copy[8 + cols_len] += get_random_number() * data_std['DDRB%']
    data_copy[9 + cols_len] += get_random_number() * data_std['OFT/FGA'] * 100
    data_copy[10 + cols_len] += get_random_number() * data_std['DFT/FGA'] * 100
    data_copy[42 + cols_len] += get_random_number() * data_std['h3P%'] * 100
    data_copy[43 + cols_len] += get_random_number() * data_std['hFT%'] * 100
    data_copy[44 + cols_len] += get_random_number() * data_std['BLK%']
    data_copy[51 + cols_len] += get_random_number() * data_std['AST%']
    data_copy[53 + cols_len] += get_random_number() * data_std['STL%'] / 100

    return data_copy


def bootstrap(year1, team1, year2, team2, mongo):
    """predict 100 random games."""
    output = {}
    data, tc1, tc2 = prepare_data(year1, team1, year2, team2, mongo)
    data_df = pd.DataFrame(data.reshape(1, 111))
    data_copy = data.copy()
    num_trials = 99
    for i in range(num_trials):
        rand_data = randomize_data(year1, team1, year2, team2, data_copy)
        data_df.loc[len(data_df)] = rand_data
    data_df -= ml_stats_mean
    data_df = data_df / ml_stats_std
    global graph
    with graph.as_default():
        prediction = model.predict(data_df)
    estimator = FFTKDE(kernel='gaussian', bw='silverman')
    over_under = [x for x in prediction[:, 0] + prediction[:, 1]]
    spread = [x for x in prediction[:, 1] - prediction[:, 0]]
    home_wins = 0
    for i in range(num_trials + 1):
        if prediction[i, 0] > prediction[i, 1]:
            home_wins += 1
    home_win_pct = home_wins / (num_trials + 1)
    est_win_pct = round((home_win_pct * 200) - 100)
    if est_win_pct < 0:
        output['win_bar_color'] = str(tc2)
    else:
        output['win_bar_color'] = str(tc1)
    output['est_win_pct'] = str(-1 * est_win_pct)
    grid_min_oe = np.floor(np.min(over_under))
    grid_max_oe = np.ceil(np.max(over_under))
    grid_min_s = np.floor(np.min(spread))
    grid_max_s = np.ceil(np.max(spread))
    grid_oe = int(grid_max_oe - grid_min_oe) * 100
    grid_s = int(grid_max_s - grid_min_s) * 100
    oe_x, oe_y = estimator.fit(over_under, weights=None).evaluate(grid_oe)
    oe_df = pd.DataFrame({'x': oe_x, 'y': oe_y})
    oe_df['x_round'] = round(oe_df['x'])
    oe_x_group = oe_df.groupby('x_round')
    oe_ys = oe_x_group['y'].sum()
    oe_x = list(oe_ys.index)
    oe_y = list(oe_ys)
    sum_oe_y = sum(oe_y)
    oe_y_norm = [x / sum_oe_y for x in oe_y]
    s_x, s_y = estimator.fit(spread, weights=None).evaluate(grid_s)
    s_df = pd.DataFrame({'x': s_x, 'y': s_y})
    s_df['x_round'] = round(s_df['x'])
    s_x_group = s_df.groupby('x_round')
    s_ys = s_x_group['y'].sum()
    s_x = list(s_ys.index)
    s_y = list(s_ys)
    sum_s_y = sum(s_y)
    min_spread = np.floor(min(s_x))
    max_spread = np.ceil(max(s_x))
    spread_bound = max(abs(min_spread), abs(max_spread))
    output['spread_bounds'] = [str(-1 * spread_bound), str(spread_bound)]
    spread_colors = []
    for i in range(len(s_x)):
        if s_x[i] <= 0:
            spread_colors.append(tc1)
        else:
            spread_colors.append(tc2)
    output['spread_colors'] = spread_colors
    s_y_norm = [x / sum_s_y for x in s_y]
    output['home_points'] = [str(x) for x in prediction[:, 0]]
    output['away_points'] = [str(x) for x in prediction[:, 1]]
    output['over_under_x'] = [str(x) for x in oe_x]
    output['over_under_y'] = [str(x * 100) for x in oe_y_norm]
    output['spread_x'] = [str(x) for x in s_x]
    output['spread_y'] = [str(x * 100) for x in s_y_norm]
    output['over_under'] = str(round(np.mean(over_under), 1))
    output['spread'] = str(round(np.mean(spread), 1))
    output['scatter_color'] = [tc1 if prediction[x, 0] >
                               prediction[x, 1] else tc2 for x in range(len(prediction[:, 0]))]
    output['scatter_marker'] = ['circle' if prediction[x, 0] >
                                prediction[x, 1] else 'rect' for x in range(len(prediction[:, 0]))]
    output['home_point_prediction'] = str(int(round(
        np.mean([x for x in prediction[:, 0]]))))
    output['away_point_prediction'] = str(int(round(
        np.mean([x for x in prediction[:, 1]]))))
    return output
