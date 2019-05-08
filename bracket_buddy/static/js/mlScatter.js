let mlScatter;


function returnOptions(team1, team2, year1, year2, min, max) {
    var options = {
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
                        labelString: `${year1} ${team1} Points`
                    },
                    ticks: {
                        suggestedMin: min,
                        suggestedMax: max
                    }
                }
            ],
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: `${year2} ${team2} Points`
                    },
                    ticks: {
                        suggestedMin: min,
                        suggestedMax: max
                    }
                }
            ]
        }
    };
    return options
}


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
		let overallMin = Math.min(minHome, minAway);
		let overallMax = Math.max(maxHome, maxAway);
		let dataPoints = [];
		for (let i = 0; i < homePoints.length; i++) {
			dataPoints.push({ x: homePoints[i], y: awayPoints[i] });
		}
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
			options: returnOptions(team1, team2, year1, year1, overallMin, overallMax)
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
	let overallMin = Math.min(minHome, minAway);
	let overallMax = Math.max(maxHome, maxAway);
	let dataPoints = [];
	for (let i = 0; i < homePoints.length; i++) {
		dataPoints.push({ x: homePoints[i], y: awayPoints[i] });
	}
	mlScatter.data = {
		datasets: [
			{
				data: dataPoints,
				pointBackgroundColor: colors,
				pointStyle: markers
			}
		]
    };

	mlScatter.options = returnOptions(team1, team2, year1, year2, overallMin, overallMax);
	mlScatter.update();
}
