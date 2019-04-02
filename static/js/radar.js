let radarFourFactors;
let radarFourFactorsHome;
let radarFourFactorsAway;
let radarRank;
let radarHomeRank;
let radarAwayRank;

let chartColors = {
	red: 'rgb(255, 99, 132)',
	yellow: 'rgb(255, 205, 86)',
	blue: 'rgb(54, 162, 235)'
};

let color = Chart.helpers.color;

function makeRadarFourFactorsInit(ctxFourFactors) {
	let selTeam = teamDropdown.value;
	let selYear = teamYearDropdown.value;
	d3.json(`/api/radar/${selTeam}/${selYear}`).then((theData) => {
		let teamData = theData[0]['Team'];
		let teamDataArr = [];
		for (let i in teamData) {
			teamDataArr.push(teamData[i]);
		}
		let tourneyData = theData[0]['Tournament'];
		let tourneyDataArr = [];
		for (let i in tourneyData) {
			tourneyDataArr.push(tourneyData[i]);
		}
		let finalFourData = theData[0]['FinalFour'];
		let finalFourDataArr = [];
		for (let i in finalFourData) {
			finalFourDataArr.push(finalFourData[i]);
		}

		let radarData = {
			labels: [
				'Off Effective FG %',
				'Off TO%',
				'Off Off Rebound %',
				'Off FT Rate',
				'Def Effective FG %',
				'Def TO%',
				'Def Off Rebound %',
				'Def FT Rate'
			],
			datasets: [
				{
					label: `${selYear} ${selTeam}`,
					backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
					borderColor: chartColors.red,
					pointBackgroundColor: chartColors.red,
					data: teamDataArr
				},
				{
					label: 'Tournament Teams',
					backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
					borderColor: chartColors.blue,
					pointBackgroundColor: chartColors.blue,
					data: tourneyDataArr
				}
			]
		};

		radarFourFactors = new Chart(ctxFourFactors, {
			type: 'radar',
			data: radarData,
			options: {
				scale: {
					ticks: {
						beginAtZero: true
					}
				}
			}
		});
	});
}

function makeRadarFourFactors(theData, selTeam, selYear) {
	let teamData = theData[0]['Team'];
	let teamDataArr = [];
	for (let i in teamData) {
		teamDataArr.push(teamData[i]);
	}
	let tourneyData = theData[0]['Tournament'];
	let tourneyDataArr = [];
	for (let i in tourneyData) {
		tourneyDataArr.push(tourneyData[i]);
	}
	let finalFourData = theData[0]['FinalFour'];
	let finalFourDataArr = [];
	for (let i in finalFourData) {
		finalFourDataArr.push(finalFourData[i]);
	}

	let radarData = {
		labels: [
			'Off Effective FG %',
			'Off TO%',
			'Off Off Rebound %',
			'Off FT Rate',
			'Def Effective FG %',
			'Def TO%',
			'Def Off Rebound %',
			'Def FT Rate'
		],
		datasets: [
			{
				label: `${selYear} ${selTeam}`,
				backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
				borderColor: chartColors.red,
				pointBackgroundColor: chartColors.red,
				data: teamDataArr
			},
			{
				label: 'Tournament Teams',
				backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
				borderColor: chartColors.blue,
				pointBackgroundColor: chartColors.blue,
				data: tourneyDataArr
			}
		]
	};

	radarFourFactors.data = radarData;
	radarFourFactors.update();
}

function makeRadarFourFactorsComparisonInit(ctxHomeFF, ctxAwayFF) {
	let selTeamHome = homeTeamDropdown.value;
	let selYearHome = homeYearDropdown.value;
	let selTeamAway = awayTeamDropdown.value;
	let selYearAway = awayYearDropdown.value;
	d3.json(`/api/radar/compare/${selTeamHome}/${selYearHome}/${selTeamAway}/${selYearAway}`).then((theData) => {
		let teamDataHome = theData[0]['Team'];
		let teamDataAway = theData[1]['Team'];
		let teamDataHomeArr = [];
		for (let i in teamDataHome) {
			teamDataHomeArr.push(teamDataHome[i]);
		}
		let teamDataAwayArr = [];
		for (let i in teamDataAway) {
			teamDataAwayArr.push(teamDataAway[i]);
		}
		let tourneyData = theData[0]['Tournament'];
		let tourneyDataArr = [];
		for (let i in tourneyData) {
			tourneyDataArr.push(tourneyData[i]);
		}

		let radarDataHome = {
			labels: [
				'Off Effective FG %',
				'Off TO%',
				'Off Off Rebound %',
				'Off FT Rate',
				'Def Effective FG %',
				'Def TO%',
				'Def Off Rebound %',
				'Def FT Rate'
			],
			datasets: [
				{
					label: `${selYearHome} ${selTeamHome}`,
					backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
					borderColor: chartColors.red,
					pointBackgroundColor: chartColors.red,
					data: teamDataHomeArr
				},
				{
					label: 'Tournament Teams',
					backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
					borderColor: chartColors.blue,
					pointBackgroundColor: chartColors.blue,
					data: tourneyDataArr
				}
			]
		};

		let radarDataAway = {
			labels: [
				'Off Effective FG %',
				'Off TO%',
				'Off Off Rebound %',
				'Off FT Rate',
				'Def Effective FG %',
				'Def TO%',
				'Def Off Rebound %',
				'Def FT Rate'
			],
			datasets: [
				{
					label: `${selYearAway} ${selTeamAway}`,
					backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
					borderColor: chartColors.red,
					pointBackgroundColor: chartColors.red,
					data: teamDataAwayArr
				},
				{
					label: 'Tournament Teams',
					backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
					borderColor: chartColors.blue,
					pointBackgroundColor: chartColors.blue,
					data: tourneyDataArr
				}
			]
		};

		let allVals = teamDataHomeArr.concat(...teamDataAwayArr).concat(...tourneyDataArr);

		let options = {
			scale: {
				ticks: {
					beginAtZero: true,
					max: Math.max(...allVals)
				}
			}
		};

		radarFourFactorsHome = new Chart(ctxHomeFF, {
			type: 'radar',
			data: radarDataHome,
			options: options
		});

		radarFourFactorsAway = new Chart(ctxAwayFF, {
			type: 'radar',
			data: radarDataAway,
			options: options
		});
	});
}

function makeRadarFourFactorsComparison(theData, homeTeam, homeYear, awayTeam, awayYear) {
	let teamDataHome = theData[0]['Team'];
	let teamDataAway = theData[1]['Team'];
	let teamDataHomeArr = [];
	for (let i in teamDataHome) {
		teamDataHomeArr.push(teamDataHome[i]);
	}
	let teamDataAwayArr = [];
	for (let i in teamDataAway) {
		teamDataAwayArr.push(teamDataAway[i]);
	}
	let tourneyData = theData[0]['Tournament'];
	let tourneyDataArr = [];
	for (let i in tourneyData) {
		tourneyDataArr.push(tourneyData[i]);
	}

	let radarDataHome = {
		labels: [
			'Off Effective FG %',
			'Off TO%',
			'Off Off Rebound %',
			'Off FT Rate',
			'Def Effective FG %',
			'Def TO%',
			'Def Off Rebound %',
			'Def FT Rate'
		],
		datasets: [
			{
				label: `${homeYear} ${homeTeam}`,
				backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
				borderColor: chartColors.red,
				pointBackgroundColor: chartColors.red,
				data: teamDataHomeArr
			},
			{
				label: 'Tournament Teams',
				backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
				borderColor: chartColors.blue,
				pointBackgroundColor: chartColors.blue,
				data: tourneyDataArr
			}
		]
	};

	let radarDataAway = {
		labels: [
			'Off Effective FG %',
			'Off TO%',
			'Off Off Rebound %',
			'Off FT Rate',
			'Def Effective FG %',
			'Def TO%',
			'Def Off Rebound %',
			'Def FT Rate'
		],
		datasets: [
			{
				label: `${awayYear} ${awayTeam}`,
				backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
				borderColor: chartColors.red,
				pointBackgroundColor: chartColors.red,
				data: teamDataAwayArr
			},
			{
				label: 'Tournament Teams',
				backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
				borderColor: chartColors.blue,
				pointBackgroundColor: chartColors.blue,
				data: tourneyDataArr
			}
		]
	};

	let allVals = teamDataHomeArr.concat(...teamDataAwayArr).concat(...toruneyDataArr);

	let options = {
		scale: {
			ticks: {
				beginAtZero: true,
				max: Math.max(...allVals)
			}
		}
	};

	radarFourFactorsHome.data = radarDataHome;
	radarFourFactorsHome.options = options;
	radarFourFactorsHome.update();

	radarFourFactorsAway.data = radarDataAway;
	radarFourFactorsAway.options = options;
	radarFourFactorsAway.update();
}

function makeRadarRankInit(ctxRank) {
	let selTeam = teamDropdown.value;
	let selYear = teamYearDropdown.value;
	d3.json(`/api/team/year/${selTeam}/${selYear}`).then((data) => {
		let rankDataO = [];
		let rankDataD = [];
		let rankLabel = [];

		rankDataO.push(data[0]['RankAdjOE']);
		rankDataD.push(data[0]['RankAdjDE']);
		rankLabel.push('Adjusted Efficiency');
		rankDataO.push(data[0]['RankeFG_Pct_O']);
		rankDataD.push(data[0]['RankeFG_Pct_D']);
		rankLabel.push('Effective FG%');
		rankDataO.push(data[0]['RankTO_Pct_O']);
		rankDataD.push(data[0]['RankTO_Pct_D']);
		rankLabel.push('Turnover %');
		rankDataO.push(data[0]['RankOR_Pct_O']);
		rankDataD.push(data[0]['RankOR_Pct_D']);
		rankLabel.push('Offensive Rebounding %');
		rankDataO.push(data[0]['RankFT_Rate_O']);
		rankDataD.push(data[0]['RankFT_Rate_D']);
		rankLabel.push('Free Throw Rate');
		rankDataO.push(data[0]['OFF_FT_Rank']);
		rankDataD.push(data[0]['DEF_FT_Rank']);
		rankLabel.push('Free Throws');
		rankDataO.push(data[0]['OFF_2PT_Rank']);
		rankDataD.push(data[0]['DEF_2PT_Rank']);
		rankLabel.push('2Pt FG');
		rankDataO.push(data[0]['OFF_3PT_Rank']);
		rankDataD.push(data[0]['DEF_3PT_Rank']);
		rankLabel.push('3Pt FG');
		rankDataO.push(data[0]['RankFG2Pct']);
		rankDataD.push(data[0]['RankOppFG2Pct']);
		rankLabel.push('2Pt FG%');
		rankDataO.push(data[0]['RankFG3Pct']);
		rankDataD.push(data[0]['RankOppFG3Pct']);
		rankLabel.push('3Pt FG%');
		rankDataO.push(data[0]['RankFTPct']);
		rankDataD.push(data[0]['RankOppFTPct']);
		rankLabel.push('FT%');
		rankDataO.push(data[0]['RankOppBlockPct']);
		rankDataD.push(data[0]['RankBlockPct']);
		rankLabel.push('Block %');
		rankDataO.push(data[0]['RankARate']);
		rankDataD.push(data[0]['RankOppARate']);
		rankLabel.push('Assist Rate');
		rankDataO.push(data[0]['RankOppStlRate']);
		rankDataD.push(data[0]['RankStlRate']);
		rankLabel.push('Steal Rate');

		let radarRankData = {
			labels: rankLabel,
			datasets: [
				{
					label: 'Offense',
					backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
					borderColor: chartColors.red,
					pointBackgroundColor: chartColors.red,
					data: rankDataO
				},
				{
					label: 'Defense',
					backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
					borderColor: chartColors.blue,
					pointBackgroundColor: chartColors.blue,
					data: rankDataD
				}
			]
		};

		radarRank = new Chart(ctxRank, {
			type: 'radar',
			data: radarRankData,
			options: {
				scale: {
					ticks: {
						reverse: true,
						min: 1,
						max: 353
					}
				}
			}
		});
	});
}

function makeRadarRank(data) {
	let rankDataO = [];
	let rankDataD = [];
	let rankLabel = [];

	rankDataO.push(data[0]['RankAdjOE']);
	rankDataD.push(data[0]['RankAdjDE']);
	rankLabel.push('Adjusted Efficiency');
	rankDataO.push(data[0]['RankeFG_Pct_O']);
	rankDataD.push(data[0]['RankeFG_Pct_D']);
	rankLabel.push('Effective FG%');
	rankDataO.push(data[0]['RankTO_Pct_O']);
	rankDataD.push(data[0]['RankTO_Pct_D']);
	rankLabel.push('Turnover %');
	rankDataO.push(data[0]['RankOR_Pct_O']);
	rankDataD.push(data[0]['RankOR_Pct_D']);
	rankLabel.push('Offensive Rebounding %');
	rankDataO.push(data[0]['RankFT_Rate_O']);
	rankDataD.push(data[0]['RankFT_Rate_D']);
	rankLabel.push('Free Throw Rate');
	rankDataO.push(data[0]['OFF_FT_Rank']);
	rankDataD.push(data[0]['DEF_FT_Rank']);
	rankLabel.push('Free Throws');
	rankDataO.push(data[0]['OFF_2PT_Rank']);
	rankDataD.push(data[0]['DEF_2PT_Rank']);
	rankLabel.push('2Pt FG');
	rankDataO.push(data[0]['OFF_3PT_Rank']);
	rankDataD.push(data[0]['DEF_3PT_Rank']);
	rankLabel.push('3Pt FG');
	rankDataO.push(data[0]['RankFG2Pct']);
	rankDataD.push(data[0]['RankOppFG2Pct']);
	rankLabel.push('2Pt FG%');
	rankDataO.push(data[0]['RankFG3Pct']);
	rankDataD.push(data[0]['RankOppFG3Pct']);
	rankLabel.push('3Pt FG%');
	rankDataO.push(data[0]['RankFTPct']);
	rankDataD.push(data[0]['RankOppFTPct']);
	rankLabel.push('FT%');
	rankDataO.push(data[0]['RankOppBlockPct']);
	rankDataD.push(data[0]['RankBlockPct']);
	rankLabel.push('Block %');
	rankDataO.push(data[0]['RankARate']);
	rankDataD.push(data[0]['RankOppARate']);
	rankLabel.push('Assist Rate');
	rankDataO.push(data[0]['RankOppStlRate']);
	rankDataD.push(data[0]['RankStlRate']);
	rankLabel.push('Steal Rate');

	let radarRankData = {
		labels: rankLabel,
		datasets: [
			{
				label: 'Offense',
				backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
				borderColor: chartColors.red,
				pointBackgroundColor: chartColors.red,
				data: rankDataO
			},
			{
				label: 'Defense',
				backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
				borderColor: chartColors.blue,
				pointBackgroundColor: chartColors.blue,
				data: rankDataD
			}
		]
	};

	radarRank.data = radarRankData;
	radarRank.update();
}

function makeRadarRankCompareInit(ctxHome, ctxAway) {
	let selTeamHome = homeTeamDropdown.value;
	let selYearHome = homeYearDropdown.value;
	let selTeamAway = awayTeamDropdown.value;
	let selYearAway = awayYearDropdown.value;
	d3.json(`/api/barDouble/${selTeamHome}/${selYearHome}/${selTeamAway}/${selYearAway}`).then((data) => {
		let rankDataO_H = [];
		let rankDataD_H = [];
		let rankDataO_A = [];
		let rankDataD_A = [];
		let rankLabel = [];

		rankDataO_H.push(data[0]['RankAdjOE']);
		rankDataD_H.push(data[0]['RankAdjDE']);
		rankLabel.push('Adjusted Efficiency');
		rankDataO_H.push(data[0]['RankeFG_Pct_O']);
		rankDataD_H.push(data[0]['RankeFG_Pct_D']);
		rankLabel.push('Effective FG%');
		rankDataO_H.push(data[0]['RankTO_Pct_O']);
		rankDataD_H.push(data[0]['RankTO_Pct_D']);
		rankLabel.push('Turnover %');
		rankDataO_H.push(data[0]['RankOR_Pct_O']);
		rankDataD_H.push(data[0]['RankOR_Pct_D']);
		rankLabel.push('Offensive Rebounding %');
		rankDataO_H.push(data[0]['RankFT_Rate_O']);
		rankDataD_H.push(data[0]['RankFT_Rate_D']);
		rankLabel.push('Free Throw Rate');
		rankDataO_H.push(data[0]['OFF_FT_Rank']);
		rankDataD_H.push(data[0]['DEF_FT_Rank']);
		rankLabel.push('Free Throws');
		rankDataO_H.push(data[0]['OFF_2PT_Rank']);
		rankDataD_H.push(data[0]['DEF_2PT_Rank']);
		rankLabel.push('2Pt FG');
		rankDataO_H.push(data[0]['OFF_3PT_Rank']);
		rankDataD_H.push(data[0]['DEF_3PT_Rank']);
		rankLabel.push('3Pt FG');
		rankDataO_H.push(data[0]['RankFG2Pct']);
		rankDataD_H.push(data[0]['RankOppFG2Pct']);
		rankLabel.push('2Pt FG%');
		rankDataO_H.push(data[0]['RankFG3Pct']);
		rankDataD_H.push(data[0]['RankOppFG3Pct']);
		rankLabel.push('3Pt FG%');
		rankDataO_H.push(data[0]['RankFTPct']);
		rankDataD_H.push(data[0]['RankOppFTPct']);
		rankLabel.push('FT%');
		rankDataO_H.push(data[0]['RankOppBlockPct']);
		rankDataD_H.push(data[0]['RankBlockPct']);
		rankLabel.push('Block %');
		rankDataO_H.push(data[0]['RankARate']);
		rankDataD_H.push(data[0]['RankOppARate']);
		rankLabel.push('Assist Rate');
		rankDataO_H.push(data[0]['RankOppStlRate']);
		rankDataD_H.push(data[0]['RankStlRate']);
		rankLabel.push('Steal Rate');

		rankDataO_A.push(data[1]['RankAdjOE']);
		rankDataD_A.push(data[1]['RankAdjDE']);
		rankDataO_A.push(data[1]['RankeFG_Pct_O']);
		rankDataD_A.push(data[1]['RankeFG_Pct_D']);
		rankDataO_A.push(data[1]['RankTO_Pct_O']);
		rankDataD_A.push(data[1]['RankTO_Pct_D']);
		rankDataO_A.push(data[1]['RankOR_Pct_O']);
		rankDataD_A.push(data[1]['RankOR_Pct_D']);
		rankDataO_A.push(data[1]['RankFT_Rate_O']);
		rankDataD_A.push(data[1]['RankFT_Rate_D']);
		rankDataO_A.push(data[1]['OFF_FT_Rank']);
		rankDataD_A.push(data[1]['DEF_FT_Rank']);
		rankDataO_A.push(data[1]['OFF_2PT_Rank']);
		rankDataD_A.push(data[1]['DEF_2PT_Rank']);
		rankDataO_A.push(data[1]['OFF_3PT_Rank']);
		rankDataD_A.push(data[1]['DEF_3PT_Rank']);
		rankDataO_A.push(data[1]['RankFG2Pct']);
		rankDataD_A.push(data[1]['RankOppFG2Pct']);
		rankDataO_A.push(data[1]['RankFG3Pct']);
		rankDataD_A.push(data[1]['RankOppFG3Pct']);
		rankDataO_A.push(data[1]['RankFTPct']);
		rankDataD_A.push(data[1]['RankOppFTPct']);
		rankDataO_A.push(data[1]['RankOppBlockPct']);
		rankDataD_A.push(data[1]['RankBlockPct']);
		rankDataO_A.push(data[1]['RankARate']);
		rankDataD_A.push(data[1]['RankOppARate']);
		rankDataO_A.push(data[1]['RankOppStlRate']);
		rankDataD_A.push(data[1]['RankStlRate']);

		let radarDataHome = {
			labels: rankLabel,
			datasets: [
				{
					label: 'Offense',
					backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
					borderColor: chartColors.red,
					pointBackgroundColor: chartColors.red,
					data: rankDataO_H
				},
				{
					label: 'Defense',
					backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
					borderColor: chartColors.blue,
					pointBackgroundColor: chartColors.blue,
					data: rankDataD_H
				}
			]
		};

		let radarDataAway = {
			labels: rankLabel,
			datasets: [
				{
					label: 'Offense',
					backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
					borderColor: chartColors.red,
					pointBackgroundColor: chartColors.red,
					data: rankDataO_A
				},
				{
					label: 'Defense',
					backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
					borderColor: chartColors.blue,
					pointBackgroundColor: chartColors.blue,
					data: rankDataD_A
				}
			]
		};

		radarHomeRank = new Chart(ctxHome, {
			type: 'radar',
			data: radarDataHome,
			options: {
				scale: {
					ticks: {
						reverse: true,
						min: 1,
						max: 353
					}
				}
			}
		});

		radarAwayRank = new Chart(ctxAway, {
			type: 'radar',
			data: radarDataAway,
			options: {
				scale: {
					ticks: {
						reverse: true,
						min: 1,
						max: 353
					}
				}
			}
		});
	});
}

function makeRadarRankCompare(data) {
	let rankDataO_H = [];
	let rankDataD_H = [];
	let rankDataO_A = [];
	let rankDataD_A = [];
	let rankLabel = [];

	rankDataO_H.push(data[0]['RankAdjOE']);
	rankDataD_H.push(data[0]['RankAdjDE']);
	rankLabel.push('Adjusted Efficiency');
	rankDataO_H.push(data[0]['RankeFG_Pct_O']);
	rankDataD_H.push(data[0]['RankeFG_Pct_D']);
	rankLabel.push('Effective FG%');
	rankDataO_H.push(data[0]['RankTO_Pct_O']);
	rankDataD_H.push(data[0]['RankTO_Pct_D']);
	rankLabel.push('Turnover %');
	rankDataO_H.push(data[0]['RankOR_Pct_O']);
	rankDataD_H.push(data[0]['RankOR_Pct_D']);
	rankLabel.push('Offensive Rebounding %');
	rankDataO_H.push(data[0]['RankFT_Rate_O']);
	rankDataD_H.push(data[0]['RankFT_Rate_D']);
	rankLabel.push('Free Throw Rate');
	rankDataO_H.push(data[0]['OFF_FT_Rank']);
	rankDataD_H.push(data[0]['DEF_FT_Rank']);
	rankLabel.push('Free Throws');
	rankDataO_H.push(data[0]['OFF_2PT_Rank']);
	rankDataD_H.push(data[0]['DEF_2PT_Rank']);
	rankLabel.push('2Pt FG');
	rankDataO_H.push(data[0]['OFF_3PT_Rank']);
	rankDataD_H.push(data[0]['DEF_3PT_Rank']);
	rankLabel.push('3Pt FG');
	rankDataO_H.push(data[0]['RankFG2Pct']);
	rankDataD_H.push(data[0]['RankOppFG2Pct']);
	rankLabel.push('2Pt FG%');
	rankDataO_H.push(data[0]['RankFG3Pct']);
	rankDataD_H.push(data[0]['RankOppFG3Pct']);
	rankLabel.push('3Pt FG%');
	rankDataO_H.push(data[0]['RankFTPct']);
	rankDataD_H.push(data[0]['RankOppFTPct']);
	rankLabel.push('FT%');
	rankDataO_H.push(data[0]['RankOppBlockPct']);
	rankDataD_H.push(data[0]['RankBlockPct']);
	rankLabel.push('Block %');
	rankDataO_H.push(data[0]['RankARate']);
	rankDataD_H.push(data[0]['RankOppARate']);
	rankLabel.push('Assist Rate');
	rankDataO_H.push(data[0]['RankOppStlRate']);
	rankDataD_H.push(data[0]['RankStlRate']);
	rankLabel.push('Steal Rate');

	rankDataO_A.push(data[1]['RankAdjOE']);
	rankDataD_A.push(data[1]['RankAdjDE']);
	rankDataO_A.push(data[1]['RankeFG_Pct_O']);
	rankDataD_A.push(data[1]['RankeFG_Pct_D']);
	rankDataO_A.push(data[1]['RankTO_Pct_O']);
	rankDataD_A.push(data[1]['RankTO_Pct_D']);
	rankDataO_A.push(data[1]['RankOR_Pct_O']);
	rankDataD_A.push(data[1]['RankOR_Pct_D']);
	rankDataO_A.push(data[1]['RankFT_Rate_O']);
	rankDataD_A.push(data[1]['RankFT_Rate_D']);
	rankDataO_A.push(data[1]['OFF_FT_Rank']);
	rankDataD_A.push(data[1]['DEF_FT_Rank']);
	rankDataO_A.push(data[1]['OFF_2PT_Rank']);
	rankDataD_A.push(data[1]['DEF_2PT_Rank']);
	rankDataO_A.push(data[1]['OFF_3PT_Rank']);
	rankDataD_A.push(data[1]['DEF_3PT_Rank']);
	rankDataO_A.push(data[1]['RankFG2Pct']);
	rankDataD_A.push(data[1]['RankOppFG2Pct']);
	rankDataO_A.push(data[1]['RankFG3Pct']);
	rankDataD_A.push(data[1]['RankOppFG3Pct']);
	rankDataO_A.push(data[1]['RankFTPct']);
	rankDataD_A.push(data[1]['RankOppFTPct']);
	rankDataO_A.push(data[1]['RankOppBlockPct']);
	rankDataD_A.push(data[1]['RankBlockPct']);
	rankDataO_A.push(data[1]['RankARate']);
	rankDataD_A.push(data[1]['RankOppARate']);
	rankDataO_A.push(data[1]['RankOppStlRate']);
	rankDataD_A.push(data[1]['RankStlRate']);

	let radarDataHome = {
		labels: rankLabel,
		datasets: [
			{
				label: 'Offense',
				backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
				borderColor: chartColors.red,
				pointBackgroundColor: chartColors.red,
				data: rankDataO_H
			},
			{
				label: 'Defense',
				backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
				borderColor: chartColors.blue,
				pointBackgroundColor: chartColors.blue,
				data: rankDataD_H
			}
		]
	};

	let radarDataAway = {
		labels: rankLabel,
		datasets: [
			{
				label: 'Offense',
				backgroundColor: color(chartColors.red).alpha(0.2).rgbString(),
				borderColor: chartColors.red,
				pointBackgroundColor: chartColors.red,
				data: rankDataO_A
			},
			{
				label: 'Defense',
				backgroundColor: color(chartColors.blue).alpha(0.2).rgbString(),
				borderColor: chartColors.blue,
				pointBackgroundColor: chartColors.blue,
				data: rankDataD_A
			}
		]
	};

	radarHomeRank.data = radarDataHome;
	radarHomeRank.update();
	radarAwayRank.data = radarDataAway;
	radarAwayRank.update();
}
