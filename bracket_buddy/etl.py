import os

import pymongo
import pandas as pd
import dns

from final_four import final_fours
from team_colors import colors
# from config import uri


conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db = client.ncaa

db.basketball.remove({})

years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]
acc = ['Virginia', 'North Carolina', 'Duke', 'Florida St.', 'Virginia Tech',
       'Louisville', 'Syracuse', 'North Carolina St.', 'Clemson', 'Georgia Tech', 'Boston College', 'Miami FL', 'Wake Forest', 'Pittsburgh', 'Notre Dame']
big12 = ['Texas Tech', 'Kansas St.', 'Kansas', 'Baylor', 'Iowa St.',
         'Texas', 'Oklahoma', 'TCU', 'Oklahoma St.', 'West Virginia']
big10 = ['Purdue', 'Michigan St.', 'Michigan', 'Wisconsin', 'Maryland', 'Iowa',
         'Minnesota', 'Indiana', 'Ohio St.', 'Illinois', 'Penn St.', 'Rutgers', 'Nebraska', 'Northwestern']
pac12 = ['Washington', 'Arizona St.', 'Utah', 'Colorado', 'Oregon', 'Oregon St.',
         'UCLA', 'USC', 'Arizona', 'Stanford', 'Washington St.', 'California']
sec = ['LSU', 'Kentucky', 'Tennessee', 'Auburn', 'South Carolina', 'Mississippi',
       'Mississippi St.', 'Florida', 'Alabama', 'Arkansas', 'Texas A&M', 'Missouri', 'Georgia', 'Vanderbuilt']


def find_conference(team):
    if team in acc:
        return 'ACC'
    elif team in big12:
        return 'Big 12'
    elif team in big10:
        return 'Big 10'
    elif team in pac12:
        return 'PAC 12'
    elif team in sec:
        return 'SEC'
    else:
        return 'other'


for year in years:
    data_path = os.path.join('team_data', f'master_{year}.csv')
    data = pd.read_csv(data_path)
    for index, row in data.iterrows():
        record = row.to_dict()
        record['Conference'] = find_conference(record['TeamName'])
        record['FinalFour'] = False
        record['Champion'] = False
        team_name = record['TeamName']
        team_colors = colors.get(team_name, ["#000000", "#909090", "#FFFFFF"])
        record['color1'] = team_colors[0]
        record['color2'] = team_colors[1]
        record['color3'] = team_colors[2]
        if record['TeamName'] in final_fours[year].keys():
            record['FinalFour'] = True
            if final_fours[year][record['TeamName']]:
                record['Champion'] = True

        db.basketball.insert_one(record)
