let mlScatter;

function makeMLScatterInit(ctx) {
	let team1 = homeTeamDropdown.value;
	let year1 = homeYearDropdown.value;
	let team2 = awayTeamDropdown.value;
	let year2 = awayYearDropdown.value;
	d3.json(`/api/predictions/${team1}/${year1}/${team2}/${year2}`).then((predictData) => {
		let homePoints = predictData['home_points'].map((d) => +d);
		let awayPoints = predictData['away_points'].map((d) => +d);
		let colors = predictData['scatter_color'].map((d) => d);
		let markers = predictData['scatter_marker'].map((d) => d);
		let minHome = Math.min(...homePoints);
		let maxHome = Math.max(...homePoints);
		let minAway = Math.min(...awayPoints);
		let maxAway = Math.max(...awayPoints);
		let overallMin = Math.min(minHome, minAway) - 1;
		let overallMax = Math.max(maxHome, maxAway) + 1;
		let dataPoints = [];
		for (let i = 0; i < homePoints.length; i++) {
			dataPoints.push({ x: homePoints[i], y: awayPoints[i] });
		}
		let options = {
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						return [
							`${team1}: ${Number(tooltipItem.xLabel).toFixed()}`,
							`${team2}: ${Number(tooltipItem.yLabel).toFixed()}`
						];
					}
				}
			},
			legend: {
				display: false
			},
			scales: {
				xAxes: [
					{
						scaleLabel: {
							display: true,
							labelString: `${team1} Points`
						},
						ticks: {
							suggestedMin: overallMin,
							suggestedMax: overallMax
						}
					}
				],
				yAxes: [
					{
						scaleLabel: {
							display: true,
							labelString: `${team2} Points`
						},
						ticks: {
							suggestedMin: overallMin,
							suggestedMax: overallMax
						}
					}
				]
			}
		};

		mlScatter = new Chart(ctx, {
			type: 'scatter',
			data: {
				datasets: [
					{
						data: dataPoints,
						pointBackgroundColor: colors,
						pointStyle: markers
					}
				]
			},
			options: options
		});
	});
}

function makeMLScatter(predictData, team1, year1, team2, year2) {
	let homePoints = predictData['home_points'].map((d) => +d);
	let awayPoints = predictData['away_points'].map((d) => +d);
	let colors = predictData['scatter_color'].map((d) => d);
	let markers = predictData['scatter_marker'].map((d) => d);
	let minHome = Math.min(...homePoints);
	let maxHome = Math.max(...homePoints);
	let minAway = Math.min(...awayPoints);
	let maxAway = Math.max(...awayPoints);
	let overallMin = Math.min([ minHome, minAway ]) - 5;
	let overallMax = Math.max([ maxHome, maxAway ]) + 5;
	let dataPoints = [];
	for (let i = 0; i < homePoints.length; i++) {
		dataPoints.push({ x: homePoints[i], y: awayPoints[i] });
	}
	let options = {
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					return `${team1}: ${Number(tooltipItem.xLabel).toFixed()}, ${team2}: ${Number(
						tooltipItem.yLabel
					).toFixed()}`;
				}
			}
		},
		legend: {
			display: false
		},
		scales: {
			xAxes: {
				scaleLabel: {
					display: true,
					labelString: `${team1} Points`
				},
				ticks: {
					min: overallMin,
					max: overallMax
				}
			},
			yAxes: {
				scaleLabel: {
					display: true,
					labelString: `${team2} Points`
				},
				ticks: {
					min: overallMin,
					max: overallMax
				}
			}
		}
	};
	mlScatter.data = {
		datasets: [
			{
				data: dataPoints,
				pointBackgroundColor: colors,
				pointStyle: markers
			}
		]
	};
	mlScatter.options = options;
	mlScatter.update();
}
