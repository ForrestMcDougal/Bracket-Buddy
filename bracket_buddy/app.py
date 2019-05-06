import os

from scipy import stats
from flask import Flask, render_template
from flask_pymongo import PyMongo
import simplejson

from bracket_buddy.ml_backend import bootstrap
from bracket_buddy.team_stats import all_stats, adj_em_list, adj_oe_list, adj_de_list, adj_tempo_list, exp_list, size_list, e_fg_pct_o_list, to_pct_o_list, or_pct_o_list, ft_rate_o_list, e_fg_pct_d_list, to_pct_d_list, or_pct_d_list, ft_rate_d_list

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
        temp_doc['eFG_Pct_O'] = stats.percentileofscore(
            e_fg_pct_o_list, doc['eFG_Pct_O'])
        temp_doc['TO_Pct_O'] = 100 - \
            stats.percentileofscore(to_pct_o_list, doc['TO_Pct_O'])
        temp_doc['OR_Pct_O'] = stats.percentileofscore(
            or_pct_o_list, doc['OR_Pct_O'])
        temp_doc['FT_Rate_O'] = stats.percentileofscore(
            ft_rate_o_list, doc['FT_Rate_O'])
        temp_doc['eFG_Pct_D'] = 100 - \
            stats.percentileofscore(e_fg_pct_d_list, doc['eFG_Pct_D'])
        temp_doc['TO_Pct_D'] = stats.percentileofscore(
            to_pct_d_list, doc['TO_Pct_D'])
        temp_doc['OR_Pct_D'] = 100 - \
            stats.percentileofscore(or_pct_d_list, doc['OR_Pct_D'])
        temp_doc['FT_Rate_D'] = 100 - \
            stats.percentileofscore(ft_rate_d_list, doc['FT_Rate_D'])
        master_temp['Team'] = temp_doc
        tournament_doc = {}
        tournament_doc['eFG_Pct_O'] = stats.percentileofscore(
            e_fg_pct_o_list, all_stats[1]['Tournament']['eFG_Pct_O']['mean'])
        tournament_doc['TO_Pct_O'] = 100 - stats.percentileofscore(
            to_pct_o_list, all_stats[1]['Tournament']['TO_Pct_O']['mean'])
        tournament_doc['OR_Pct_O'] = stats.percentileofscore(
            or_pct_o_list, all_stats[1]['Tournament']['OR_Pct_O']['mean'])
        tournament_doc['FT_Rate_O'] = stats.percentileofscore(
            ft_rate_o_list, all_stats[1]['Tournament']['FT_Rate_O']['mean'])
        tournament_doc['eFG_Pct_D'] = 100 - stats.percentileofscore(
            e_fg_pct_d_list, all_stats[1]['Tournament']['eFG_Pct_D']['mean'])
        tournament_doc['TO_Pct_D'] = stats.percentileofscore(
            to_pct_d_list, all_stats[1]['Tournament']['TO_Pct_D']['mean'])
        tournament_doc['OR_Pct_D'] = 100 - stats.percentileofscore(
            or_pct_d_list, all_stats[1]['Tournament']['OR_Pct_D']['mean'])
        tournament_doc['FT_Rate_D'] = 100 - stats.percentileofscore(
            ft_rate_d_list, all_stats[1]['Tournament']['FT_Rate_D']['mean'])
        master_temp['Tournament'] = tournament_doc
        ff_doc = {}
        ff_doc['eFG_Pct_O'] = stats.percentileofscore(
            e_fg_pct_o_list, all_stats[2]['FinalFour']['eFG_Pct_O']['mean'])
        ff_doc['TO_Pct_O'] = 100 - stats.percentileofscore(
            to_pct_o_list, all_stats[2]['FinalFour']['TO_Pct_O']['mean'])
        ff_doc['OR_Pct_O'] = stats.percentileofscore(
            or_pct_o_list, all_stats[2]['FinalFour']['OR_Pct_O']['mean'])
        ff_doc['FT_Rate_O'] = stats.percentileofscore(
            ft_rate_o_list, all_stats[2]['FinalFour']['FT_Rate_O']['mean'])
        ff_doc['eFG_Pct_D'] = 100 - stats.percentileofscore(
            e_fg_pct_d_list, all_stats[2]['FinalFour']['eFG_Pct_D']['mean'])
        ff_doc['TO_Pct_D'] = stats.percentileofscore(
            to_pct_d_list, all_stats[2]['FinalFour']['TO_Pct_D']['mean'])
        ff_doc['OR_Pct_D'] = 100 - stats.percentileofscore(
            or_pct_d_list, all_stats[2]['FinalFour']['OR_Pct_D']['mean'])
        ff_doc['FT_Rate_D'] = 100 - stats.percentileofscore(
            ft_rate_d_list, all_stats[2]['FinalFour']['FT_Rate_D']['mean'])
        master_temp['FinalFour'] = ff_doc
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
        temp_doc['eFG_Pct_O'] = stats.percentileofscore(
            e_fg_pct_o_list, doc['eFG_Pct_O'])
        temp_doc['TO_Pct_O'] = 100 - \
            stats.percentileofscore(to_pct_o_list, doc['TO_Pct_O'])
        temp_doc['OR_Pct_O'] = stats.percentileofscore(
            or_pct_o_list, doc['OR_Pct_O'])
        temp_doc['FT_Rate_O'] = stats.percentileofscore(
            ft_rate_o_list, doc['FT_Rate_O'])
        temp_doc['eFG_Pct_D'] = 100 - \
            stats.percentileofscore(e_fg_pct_d_list, doc['eFG_Pct_D'])
        temp_doc['TO_Pct_D'] = stats.percentileofscore(
            to_pct_d_list, doc['TO_Pct_D'])
        temp_doc['OR_Pct_D'] = 100 - \
            stats.percentileofscore(or_pct_d_list, doc['OR_Pct_D'])
        temp_doc['FT_Rate_D'] = 100 - \
            stats.percentileofscore(ft_rate_d_list, doc['FT_Rate_D'])
        master_temp['Team'] = temp_doc
        tournament_doc = {}
        tournament_doc['eFG_Pct_O'] = stats.percentileofscore(
            e_fg_pct_o_list, all_stats[1]['Tournament']['eFG_Pct_O']['mean'])
        tournament_doc['TO_Pct_O'] = 100 - stats.percentileofscore(
            to_pct_o_list, all_stats[1]['Tournament']['TO_Pct_O']['mean'])
        tournament_doc['OR_Pct_O'] = stats.percentileofscore(
            or_pct_o_list, all_stats[1]['Tournament']['OR_Pct_O']['mean'])
        tournament_doc['FT_Rate_O'] = stats.percentileofscore(
            ft_rate_o_list, all_stats[1]['Tournament']['FT_Rate_O']['mean'])
        tournament_doc['eFG_Pct_D'] = 100 - stats.percentileofscore(
            e_fg_pct_d_list, all_stats[1]['Tournament']['eFG_Pct_D']['mean'])
        tournament_doc['TO_Pct_D'] = stats.percentileofscore(
            to_pct_d_list, all_stats[1]['Tournament']['TO_Pct_D']['mean'])
        tournament_doc['OR_Pct_D'] = 100 - stats.percentileofscore(
            or_pct_d_list, all_stats[1]['Tournament']['OR_Pct_D']['mean'])
        tournament_doc['FT_Rate_D'] = 100 - stats.percentileofscore(
            ft_rate_d_list, all_stats[1]['Tournament']['FT_Rate_D']['mean'])
        master_temp['Tournament'] = tournament_doc
        ff_doc = {}
        ff_doc['eFG_Pct_O'] = stats.percentileofscore(
            e_fg_pct_o_list, all_stats[2]['FinalFour']['eFG_Pct_O']['mean'])
        ff_doc['TO_Pct_O'] = 100 - stats.percentileofscore(
            to_pct_o_list, all_stats[2]['FinalFour']['TO_Pct_O']['mean'])
        ff_doc['OR_Pct_O'] = stats.percentileofscore(
            or_pct_o_list, all_stats[2]['FinalFour']['OR_Pct_O']['mean'])
        ff_doc['FT_Rate_O'] = stats.percentileofscore(
            ft_rate_o_list, all_stats[2]['FinalFour']['FT_Rate_O']['mean'])
        ff_doc['eFG_Pct_D'] = 100 - stats.percentileofscore(
            e_fg_pct_d_list, all_stats[2]['FinalFour']['eFG_Pct_D']['mean'])
        ff_doc['TO_Pct_D'] = stats.percentileofscore(
            to_pct_d_list, all_stats[2]['FinalFour']['TO_Pct_D']['mean'])
        ff_doc['OR_Pct_D'] = 100 - stats.percentileofscore(
            or_pct_d_list, all_stats[2]['FinalFour']['OR_Pct_D']['mean'])
        ff_doc['FT_Rate_D'] = 100 - stats.percentileofscore(
            ft_rate_d_list, all_stats[2]['FinalFour']['FT_Rate_D']['mean'])
        master_temp['FinalFour'] = ff_doc
        docs.append(master_temp)

    team_year_info = mongo.db.basketball.find(
        {'TeamName': str(team2), 'Season': int(year2)})
    for doc in team_year_info:
        doc.pop('_id')
        master_temp = {}
        temp_doc = {}
        temp_doc['eFG_Pct_O'] = stats.percentileofscore(
            e_fg_pct_o_list, doc['eFG_Pct_O'])
        temp_doc['TO_Pct_O'] = 100 - \
            stats.percentileofscore(to_pct_o_list, doc['TO_Pct_O'])
        temp_doc['OR_Pct_O'] = stats.percentileofscore(
            or_pct_o_list, doc['OR_Pct_O'])
        temp_doc['FT_Rate_O'] = stats.percentileofscore(
            ft_rate_o_list, doc['FT_Rate_O'])
        temp_doc['eFG_Pct_D'] = 100 - \
            stats.percentileofscore(e_fg_pct_d_list, doc['eFG_Pct_D'])
        temp_doc['TO_Pct_D'] = stats.percentileofscore(
            to_pct_d_list, doc['TO_Pct_D'])
        temp_doc['OR_Pct_D'] = 100 - \
            stats.percentileofscore(or_pct_d_list, doc['OR_Pct_D'])
        temp_doc['FT_Rate_D'] = 100 - \
            stats.percentileofscore(ft_rate_d_list, doc['FT_Rate_D'])
        master_temp['Team'] = temp_doc
        docs.append(master_temp)
    return simplejson.dumps(docs, ignore_nan=True)


@app.route('/api/predictions/<team1>/<year1>/<team2>/<year2>')
def predict(team1, year1, team2, year2):
    output = bootstrap(year1, team1, year2, team2, mongo)
    return simplejson.dumps(output, ignore_nan=True)


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
