let barChart;
let doubleBarChart;

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

function makeBarChartInit(ctx) {
	let selTeam = teamDropdown.value;
	let selYear = teamYearDropdown.value;
	d3.json(`/api/barSingle/${selTeam}/${selYear}`).then((data) => {
		let rankData = [];

		rankData.push(data[0]['norm_ADJ_EM']);
		rankData.push(data[0]['norm_Tempo']);
		rankData.push(data[0]['norm_OE']);
		rankData.push(data[0]['norm_DE']);
		rankData.push(data[0]['norm_Exp']);
		rankData.push(data[0]['norm_Size']);

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

		barChart = new Chart(ctx, {
			type: 'bar',
			data: {
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
			},
			options: options
		});
	});
}

function makeDoubleBarChartInit(ctx) {
	let selTeamHome = homeTeamDropdown.value;
	let selYearHome = homeYearDropdown.value;
	let selTeamAway = awayTeamDropdown.value;
	let selYearAway = awayYearDropdown.value;
	d3.json(`/api/barDouble/${selTeamHome}/${selYearHome}/${selTeamAway}/${selYearAway}`).then((data) => {
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

		doubleBarChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: [ 'Adj EM', 'Tempo', 'OE', 'DE', 'Exp', 'Size' ],
				datasets: [
					{
						label: `${selYearHome} ${selTeamHome}`,
						data: data1,
						backgroundColor: data[0]['color1'],
						borderColor: data[0]['color2'],
						borderWidth: '3',
						hoverBorderColor: data[0]['color1'],
						hoverBackgroundColor: data[0]['color2']
					},
					{
						label: `${selYearAway} ${selTeamAway}`,
						data: data2,
						backgroundColor: data[1]['color1'],
						borderColor: data[1]['color2'],
						borderWidth: '3',
						hoverBorderColor: data[1]['color1'],
						hoverBackgroundColor: data[1]['color2']
					}
				]
			},
			options: options
		});
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
	barChart.options = options;
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
	doubleBarChart.options = options;
	doubleBarChart.update();
}
