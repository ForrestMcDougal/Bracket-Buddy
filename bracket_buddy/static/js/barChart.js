let barChart;
let doubleBarChart;
let winBar;

function makeBarChartInit(ctx) {
	barChart = new Chart(ctx, {
		type: 'bar'
	});
}

function makeDoubleBarChartInit(ctx) {
	doubleBarChart = new Chart(ctx, {
		type: 'bar'
	});
}

function makeBarChart(data, selTeam) {
	let rankData = [];

	rankData.push(data[0]['norm_ADJ_EM']);
	rankData.push(data[0]['norm_Tempo']);
	rankData.push(data[0]['norm_OE']);
	rankData.push(data[0]['norm_DE']);
	rankData.push(data[0]['norm_Exp']);
	rankData.push(data[0]['norm_Size']);

	barChart.data = {
		labels: [ 'Adj EM', 'Tempo', 'OE', 'DE', 'Exp', 'Size' ],
		datasets: [
			{
				label: selTeam,
				data: rankData,
				backgroundColor: data[0]['color1'],
				borderColor: data[0]['color2'],
				borderWidth: '3',
				hoverBorderColor: data[0]['color1'],
				hoverBackgroundColor: data[0]['color2']
			}
		]
	};

	barChart.options = makeBarChartOptions(data);
	barChart.update();
}

function makeDoubleBarChart(data, homeTeam, homeYear, awayTeam, awayYear) {
	let data1 = [];
	let data2 = [];

	data1.push(data[0]['norm_ADJ_EM']);
	data1.push(data[0]['norm_Tempo']);
	data1.push(data[0]['norm_OE']);
	data1.push(data[0]['norm_DE']);
	data1.push(data[0]['norm_Exp']);
	data1.push(data[0]['norm_Size']);

	data2.push(data[1]['norm_ADJ_EM']);
	data2.push(data[1]['norm_Tempo']);
	data2.push(data[1]['norm_OE']);
	data2.push(data[1]['norm_DE']);
	data2.push(data[1]['norm_Exp']);
	data2.push(data[1]['norm_Size']);

	doubleBarChart.data = {
		labels: [ 'Adj EM', 'Tempo', 'OE', 'DE', 'Exp', 'Size' ],
		datasets: [
			{
				label: `${homeYear} ${homeTeam}`,
				data: data1,
				backgroundColor: data[0]['color1'],
				borderColor: data[0]['color2'],
				borderWidth: '3',
				hoverBorderColor: data[0]['color1'],
				hoverBackgroundColor: data[0]['color2']
			},
			{
				label: `${awayYear} ${awayTeam}`,
				data: data2,
				backgroundColor: data[1]['color1'],
				borderColor: data[1]['color2'],
				borderWidth: '3',
				hoverBorderColor: data[1]['color1'],
				hoverBackgroundColor: data[1]['color2']
			}
		]
	};
	doubleBarChart.options = makeDoubleBarChartOptions(data);
	doubleBarChart.update();
}

function makeWinBarInit(ctx) {
	winBar = new Chart(ctx, {
		type: 'horizontalBar'
	});
}

function makeWinBar(data, year1, team1, year2, team2) {
	let est_win = +data.est_win_pct;
	let color = data['win_bar_color'];
	winBar.data = {
		labels: [ '%' ],
		datasets: [
			{
				label: 'Estimated Win %',
				backgroundColor: color,
				data: [ est_win ]
			}
		]
	};
	winBar.options = makeWinBarOptions(est_win, year1, team1, year2, team2);
	winBar.update();
}

function makeBarChartOptions(data) {
	let options = {
		tooltips: {
			callbacks: {
				label: function(tooltipItem) {
					let avg = `Percentile: ${Number(tooltipItem.yLabel).toFixed(2)}`;
					return [ avg ].concat(...rawLabel(tooltipItem.xLabel, data, tooltipItem.datasetIndex));
				}
			}
		},
		scales: {
			yAxes: [
				{
					display: true,
					ticks: {
						beginAtZero: true,
						max: 100
					},
					scaleLabel: {
						display: true,
						labelString: 'Percentile'
					}
				}
			]
		}
	};
	return options;
}

function makeDoubleBarChartOptions(data) {
	let options = {
		tooltips: {
			callbacks: {
				label: function(tooltipItem) {
					let avg = `Percentile: ${Number(tooltipItem.yLabel).toFixed(2)}`;
					return [ avg ].concat(...rawLabel(tooltipItem.xLabel, data, tooltipItem.datasetIndex));
				}
			}
		},
		scales: {
			yAxes: [
				{
					display: true,
					ticks: {
						beginAtZero: true,
						max: 100
					},
					scaleLabel: {
						display: true,
						labelString: 'Percentile'
					}
				}
			]
		}
	};
	return options;
}

function makeWinBarOptions(est_win, year1, team1, year2, team2) {
	let winner;
	let est_win_abs;
	if (est_win < 0) {
		winner = `${year1} ${team1}`;
		est_win_abs = -1 * est_win;
	} else {
		winner = `${year2} ${team2}`;
		est_win_abs = est_win;
	}
	let options = {
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					return `${winner}: ${est_win_abs}%`;
				}
			}
		},
		legend: { display: false },
		title: {
			display: true,
			text: 'Probability of Winning'
		},
		scales: {
			xAxes: [
				{
					barThickness: 20,
					ticks: {
						min: -100,
						max: 100
					},
					scaleLabel: {
						display: true,
						labelString: `<- ${year1} ${team1} || ${year2} ${team2} ->`
					}
				}
			]
		}
	};
	return options;
}

function rawLabel(xLabel, data, indx) {
	switch (xLabel) {
		case 'Adj EM':
			return [ `Raw: ${data[indx]['AdjEM'].toFixed(2)}`, `Rank: ${data[indx]['RankAdjEM']}` ];
			break;
		case 'Tempo':
			return [ `Raw: ${data[indx]['AdjTempo'].toFixed(2)}`, `Rank: ${data[indx]['RankAdjTempo']}` ];
			break;
		case 'OE':
			return [ `Raw: ${data[indx]['AdjOE'].toFixed(2)}`, `Rank: ${data[indx]['RankAdjOE']}` ];
			break;
		case 'DE':
			return [ `Raw: ${data[indx]['AdjDE'].toFixed(2)}`, `Rank: ${data[indx]['RankAdjDE']}` ];
			break;
		case 'Exp':
			return [ `Raw: ${data[indx]['Exp'].toFixed(2)}`, `Rank: ${data[indx]['ExpRank']}` ];
			break;
		case 'Size':
			return [ `Raw: ${data[indx]['Size'].toFixed(2)}`, `Rank: ${data[indx]['SizeRank']}` ];
			break;
	}
}
