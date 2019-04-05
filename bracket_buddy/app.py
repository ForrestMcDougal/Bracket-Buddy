import os

from scipy import stats
from flask import Flask, render_template
from flask_pymongo import PyMongo
import simplejson

from bracket_buddy.team_stats import all_stats, adj_em_list, adj_oe_list, adj_de_list, adj_tempo_list, exp_list, size_list

app = Flask(__name__)

app.config["MONGO_URI"] = os.environ.get(
    'MONGO_URI', 'mongodb://localhost:27017/ncaa')
mongo = PyMongo(app)


@app.route('/api/all')
def all_data():
    data = mongo.db.basketball.find({})
    docs = []
    for doc in data:
        doc.pop('_id')
        docs.append(doc)
    return simplejson.dumps(docs, ignore_nan=True)


@app.route("/api/team/<team>")
def team_data(team):
    team_info = mongo.db.basketball.find({'TeamName': str(team)})
    docs = []
    for doc in team_info:
        doc.pop('_id')
        docs.append(doc)
    return simplejson.dumps(docs, ignore_nan=True)


@app.route("/api/year/<year>")
def year_data(year):
    year_info = mongo.db.basketball.find({'Season': int(year)})
    docs = []
    for doc in year_info:
        doc.pop('_id')
        docs.append(doc)
    return simplejson.dumps(docs, ignore_nan=True)


@app.route("/api/team/year/<team>/<year>")
def team_year_data(team, year):
    team_year_info = mongo.db.basketball.find(
        {'TeamName': str(team), 'Season': int(year)})
    docs = []
    for doc in team_year_info:
        doc.pop('_id')
        docs.append(doc)
    return simplejson.dumps(docs, ignore_nan=True)


@app.route("/api/scatter/<year>/<team>/<team_year>")
def scatter(year, team, team_year):
    if year == 'all':
        year_info = mongo.db.basketball.find({})
    else:
        year_info = mongo.db.basketball.find({'Season': int(year)})
    docs = []
    for doc in year_info:
        doc.pop('_id')
        doc['featured'] = False
        docs.append(doc)
    if team != 'none':
        team = mongo.db.basketball.find(
            {'Season': int(team_year), 'TeamName': team})
        for doc in team:
            doc.pop('_id')
            doc['featured'] = True
            docs.append(doc)
    return simplejson.dumps(docs, ignore_nan=True)


@app.route('/api/barSingle/<team>/<year>')
def singleBar(team, year):
    team_year_info = mongo.db.basketball.find(
        {'TeamName': str(team), 'Season': int(year)})
    docs = []
    for doc in team_year_info:
        doc.pop('_id')
        doc['norm_ADJ_EM'] = stats.percentileofscore(adj_em_list, doc['AdjEM'])
        doc['norm_OE'] = stats.percentileofscore(adj_oe_list, doc['AdjOE'])
        doc['norm_DE'] = 100 - \
            stats.percentileofscore(adj_de_list, doc['AdjDE'])
        doc['norm_Tempo'] = stats.percentileofscore(
            adj_tempo_list, doc['AdjTempo'])
        doc['norm_Exp'] = stats.percentileofscore(exp_list, doc['Exp'])
        doc['norm_Size'] = stats.percentileofscore(size_list, doc['Size'])
        docs.append(doc)
    return simplejson.dumps(docs, ignore_nan=True)


@app.route('/api/barDouble/<team1>/<year1>/<team2>/<year2>')
def doubleBar(team1, year1, team2, year2):
    docs = []
    team_year_info1 = mongo.db.basketball.find(
        {'TeamName': str(team1), 'Season': int(year1)})
    for doc in team_year_info1:
        doc.pop('_id')
        doc['norm_ADJ_EM'] = stats.percentileofscore(adj_em_list, doc['AdjEM'])
        doc['norm_OE'] = stats.percentileofscore(adj_oe_list, doc['AdjOE'])
        doc['norm_DE'] = 100 - \
            stats.percentileofscore(adj_de_list, doc['AdjDE'])
        doc['norm_Tempo'] = stats.percentileofscore(
            adj_tempo_list, doc['AdjTempo'])
        doc['norm_Exp'] = stats.percentileofscore(exp_list, doc['Exp'])
        doc['norm_Size'] = stats.percentileofscore(size_list, doc['Size'])
        docs.append(doc)
    team_year_info2 = mongo.db.basketball.find(
        {'TeamName': str(team2), 'Season': int(year2)})
    for doc in team_year_info2:
        doc.pop('_id')
        doc['norm_ADJ_EM'] = stats.percentileofscore(adj_em_list, doc['AdjEM'])
        doc['norm_OE'] = stats.percentileofscore(adj_oe_list, doc['AdjOE'])
        doc['norm_DE'] = 100 - \
            stats.percentileofscore(adj_de_list, doc['AdjDE'])
        doc['norm_Tempo'] = stats.percentileofscore(
            adj_tempo_list, doc['AdjTempo'])
        doc['norm_Exp'] = stats.percentileofscore(exp_list, doc['Exp'])
        doc['norm_Size'] = stats.percentileofscore(size_list, doc['Size'])
        docs.append(doc)
    return simplejson.dumps(docs, ignore_nan=True)


@app.route('/api/radar/<team>/<year>')
def radar(team, year):
    team_year_info = mongo.db.basketball.find(
        {'TeamName': str(team), 'Season': int(year)})
    docs = []
    for doc in team_year_info:
        doc.pop('_id')
        master_temp = {}
        temp_doc = {}
        temp_doc['eFG_Pct_O'] = doc['eFG_Pct_O'] / \
            all_stats[0]['All']['eFG_Pct_O']['mean']
        temp_doc['TO_Pct_O'] = all_stats[0]['All']['TO_Pct_O']['mean'] / \
            doc['TO_Pct_O']
        temp_doc['OR_Pct_O'] = doc['OR_Pct_O'] / \
            all_stats[0]['All']['OR_Pct_O']['mean']
        temp_doc['FT_Rate_O'] = doc['FT_Rate_O'] / \
            all_stats[0]['All']['FT_Rate_O']['mean']
        temp_doc['eFG_Pct_D'] = all_stats[0]['All']['eFG_Pct_D']['mean'] / \
            doc['eFG_Pct_D']
        temp_doc['TO_Pct_D'] = doc['TO_Pct_D'] / \
            all_stats[0]['All']['TO_Pct_D']['mean']
        temp_doc['OR_Pct_D'] = all_stats[0]['All']['OR_Pct_D']['mean'] / \
            doc['OR_Pct_D']
        temp_doc['FT_Rate_D'] = all_stats[0]['All']['FT_Rate_D']['mean'] / \
            doc['FT_Rate_D']
        master_temp['Team'] = temp_doc
        tournament_doc = {}
        tournament_doc['eFG_Pct_O'] = 1.0460424505970831
        tournament_doc['TO_Pct_O'] = 1.073456866651516
        tournament_doc['OR_Pct_O'] = 1.0629167804186908
        tournament_doc['FT_Rate_O'] = 1.0338176225710891
        tournament_doc['eFG_Pct_D'] = 1.0493121330945443
        tournament_doc['TO_Pct_D'] = 1.0167173947951866
        tournament_doc['OR_Pct_D'] = 1.0391702499951196
        tournament_doc['FT_Rate_D'] = 1.0856409662284037
        master_temp['Tournament'] = tournament_doc
        docs.append(master_temp)
    return simplejson.dumps(docs, ignore_nan=True)


@app.route('/api/radar/compare/<team1>/<year1>/<team2>/<year2>')
def radar_compare(team1, year1, team2, year2):
    team_year_info = mongo.db.basketball.find(
        {'TeamName': str(team1), 'Season': int(year1)})
    docs = []
    for doc in team_year_info:
        doc.pop('_id')
        master_temp = {}
        temp_doc = {}
        temp_doc['eFG_Pct_O'] = doc['eFG_Pct_O'] / \
            all_stats[0]['All']['eFG_Pct_O']['mean']
        temp_doc['TO_Pct_O'] = all_stats[0]['All']['TO_Pct_O']['mean'] / \
            doc['TO_Pct_O']
        temp_doc['OR_Pct_O'] = doc['OR_Pct_O'] / \
            all_stats[0]['All']['OR_Pct_O']['mean']
        temp_doc['FT_Rate_O'] = doc['FT_Rate_O'] / \
            all_stats[0]['All']['FT_Rate_O']['mean']
        temp_doc['eFG_Pct_D'] = all_stats[0]['All']['eFG_Pct_D']['mean'] / \
            doc['eFG_Pct_D']
        temp_doc['TO_Pct_D'] = doc['TO_Pct_D'] / \
            all_stats[0]['All']['TO_Pct_D']['mean']
        temp_doc['OR_Pct_D'] = all_stats[0]['All']['OR_Pct_D']['mean'] / \
            doc['OR_Pct_D']
        temp_doc['FT_Rate_D'] = all_stats[0]['All']['FT_Rate_D']['mean'] / \
            doc['FT_Rate_D']
        master_temp['Team'] = temp_doc
        tournament_doc = {}
        tournament_doc['eFG_Pct_O'] = 1.0460424505970831
        tournament_doc['TO_Pct_O'] = 1.073456866651516
        tournament_doc['OR_Pct_O'] = 1.0629167804186908
        tournament_doc['FT_Rate_O'] = 1.0338176225710891
        tournament_doc['eFG_Pct_D'] = 1.0493121330945443
        tournament_doc['TO_Pct_D'] = 1.0167173947951866
        tournament_doc['OR_Pct_D'] = 1.0391702499951196
        tournament_doc['FT_Rate_D'] = 1.0856409662284037
        master_temp['Tournament'] = tournament_doc
        docs.append(master_temp)

    team_year_info = mongo.db.basketball.find(
        {'TeamName': str(team2), 'Season': int(year2)})
    for doc in team_year_info:
        doc.pop('_id')
        master_temp = {}
        temp_doc = {}
        temp_doc['eFG_Pct_O'] = doc['eFG_Pct_O'] / \
            stats[0]['All']['eFG_Pct_O']['mean']
        temp_doc['TO_Pct_O'] = all_stats[0]['All']['TO_Pct_O']['mean'] / \
            doc['TO_Pct_O']
        temp_doc['OR_Pct_O'] = doc['OR_Pct_O'] / \
            all_stats[0]['All']['OR_Pct_O']['mean']
        temp_doc['FT_Rate_O'] = doc['FT_Rate_O'] / \
            all_stats[0]['All']['FT_Rate_O']['mean']
        temp_doc['eFG_Pct_D'] = all_stats[0]['All']['eFG_Pct_D']['mean'] / \
            doc['eFG_Pct_D']
        temp_doc['TO_Pct_D'] = doc['TO_Pct_D'] / \
            all_stats[0]['All']['TO_Pct_D']['mean']
        temp_doc['OR_Pct_D'] = all_stats[0]['All']['OR_Pct_D']['mean'] / \
            doc['OR_Pct_D']
        temp_doc['FT_Rate_D'] = all_stats[0]['All']['FT_Rate_D']['mean'] / \
            doc['FT_Rate_D']
        master_temp['Team'] = temp_doc
        docs.append(master_temp)
    return simplejson.dumps(docs, ignore_nan=True)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/scatter')
def comparison():
    return render_template('scatter.html')


@app.route('/team')
def team_page():
    return render_template('teamPage.html')


@app.route('/comparison')
def comparison_page():
    return render_template('comparison.html')


@app.route('/reference')
def reference_page():
    return render_template('reference.html')


if __name__ == "__main__":
    app.run()
