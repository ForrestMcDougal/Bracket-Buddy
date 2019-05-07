let over_under_pdf;
let spread_pdf;

function makePDFsInit(ctxOU, ctxSpread, homeTeamNameSpan, awayTeamNameSpan, homeTeamScoreSpan, awayTeamScoreSpan) {
	let homeTeam = homeTeamDropdown.value;
	let homeYear = homeYearDropdown.value;
	let awayTeam = awayTeamDropdown.value;
	let awayYear = awayYearDropdown.value;
	d3.json(`/api/predictions/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`).then((data) => {
		homeTeamNameSpan.innerHTML = `${homeYear} ${homeTeam}`;
		awayTeamNameSpan.innerHTML = `${awayYear} ${awayTeam}`;
		homeTeamScoreSpan.innerHTML = `${data['home_point_prediction']}`;
		awayTeamScoreSpan.innerHTML = `${data['away_point_prediction']}`;
		let spread_x = data['spread_x'].map((d) => +d);
		let spread_y = data['spread_y'].map((d) => +d);
		let oe_x = data['over_under_x'].map((d) => +d);
		let oe_y = data['over_under_y'].map((d) => +d);

		let minSpread = Math.min(...spread_x).toFixed(0) - 1;
		let maxSpread = Math.max(...spread_x).toFixed(0) + 1;
		let minOE = Math.min(...oe_x).toFixed(0) - 1;
		let maxOE = Math.max(...oe_x).toFixed(0) + 1;

		let optionsSpread = {
			tooltips: {
				callbacks: {
					label: function(tooltipItem) {
						let underArr = spread_y.slice(0, tooltipItem.index);
						let under = underArr.reduce(function(a, b) {
							return a + b;
						}, 0);
						let over = 100 - under;
						return [ `Under: ${under.toFixed(2)}%`, `Over: ${over.toFixed(2)}%` ];
					}
				}
			},
			scales: {
				xAxes: [
					{
						gridLines: {
							display: false,
							color: 'black'
						},
						ticks: {
							callback: function(value, index, values) {
								return `${value.toFixed(0)}`;
							},
							min: minSpread,
							max: maxSpread,
							precision: 0,
							maxRotation: 0
						},
						scaleLabel: {
							display: true,
							labelString: 'Spread'
						}
					}
				],
				yAxes: [
					{
						gridLines: {
							display: false,
							color: 'black'
						},
						scaleLabel: {
							display: true,
							labelString: 'Probability (%)'
						}
					}
				]
			}
		};

		let optionsOE = {
			tooltips: {
				callbacks: {
					label: function(tooltipItem) {
						let underArr = oe_y.slice(0, tooltipItem.index);
						let under = underArr.reduce(function(a, b) {
							return a + b;
						}, 0);
						let over = 100 - under;
						return [ `Under: ${under.toFixed(2)}%`, `Over: ${over.toFixed(2)}%` ];
					}
				}
			},
			scales: {
				xAxes: [
					{
						gridLines: {
							display: false,
							color: 'black'
						},
						ticks: {
							callback: function(value, index, values) {
								return `${value.toFixed(0)}`;
							},
							min: minOE,
							max: maxOE,
							precision: 0,
							maxRotation: 0
						},
						scaleLabel: {
							display: true,
							labelString: 'Over Under'
						}
					}
				],
				yAxes: [
					{
						gridLines: {
							display: false,
							color: 'black'
						},
						scaleLabel: {
							display: true,
							labelString: 'Probability (%)'
						}
					}
				]
			}
		};

		over_under_pdf = new Chart(ctxOU, {
			type: 'line',
			data: {
				labels: oe_x,
				datasets: [
					{
						borderColor: '#000000',
						label: `Over Under: ${data['over_under']}`,
						data: oe_y,
						fill: true
					}
				]
			},
			options: optionsOE
		});

		spread_pdf = new Chart(ctxSpread, {
			type: 'line',
			data: {
				labels: spread_x,
				datasets: [
					{
						borderColor: '#000000',
						label: `Spread: ${data['spread']}`,
						data: spread_y,
						fill: true
					}
				]
			},
			options: optionsSpread
		});
	});
}

function makePDFs(data) {
	let spread_x = data['spread_x'].map((d) => +d);
	let spread_y = data['spread_y'].map((d) => +d);
	let oe_x = data['over_under_x'].map((d) => +d);
	let oe_y = data['over_under_y'].map((d) => +d);

	let minSpread = Math.min(...spread_x).toFixed(0) - 1;
	let maxSpread = Math.max(...spread_x).toFixed(0) + 1;
	let minOE = Math.min(...oe_x).toFixed(0) - 1;
	let maxOE = Math.max(...oe_x).toFixed(0) + 1;

	let optionsSpread = {
		tooltips: {
			callbacks: {
				label: function(tooltipItem) {
					let underArr = spread_y.slice(0, tooltipItem.index);
					let under = underArr.reduce(function(a, b) {
						return a + b;
					}, 0);
					let over = 100 - under;
					return [ `Under: ${under.toFixed(2)}%`, `Over: ${over.toFixed(2)}%` ];
				}
			}
		},
		scales: {
			xAxes: [
				{
					gridLines: {
						display: false,
						color: 'black'
					},
					ticks: {
						callback: function(value, index, values) {
							return `${value.toFixed(0)}`;
						},
						min: minSpread,
						max: maxSpread,
						precision: 0,
						maxRotation: 0
					},
					scaleLabel: {
						display: true,
						labelString: 'Spread'
					}
				}
			],
			yAxes: [
				{
					gridLines: {
						display: false,
						color: 'black'
					},
					scaleLabel: {
						display: true,
						labelString: 'Probability (%)'
					}
				}
			]
		}
	};

	let optionsOE = {
		tooltips: {
			callbacks: {
				label: function(tooltipItem) {
					let underArr = oe_y.slice(0, tooltipItem.index);
					let under = underArr.reduce(function(a, b) {
						return a + b;
					}, 0);
					let over = 100 - under;
					return [ `Under: ${under.toFixed(2)}%`, `Over: ${over.toFixed(2)}%` ];
				}
			}
		},
		scales: {
			xAxes: [
				{
					gridLines: {
						display: false,
						color: 'black'
					},
					ticks: {
						callback: function(value, index, values) {
							return `${value.toFixed(0)}`;
						},
						min: minOE,
						max: maxOE,
						precision: 0,
						maxRotation: 0
					},
					scaleLabel: {
						display: true,
						labelString: 'Over Under'
					}
				}
			],
			yAxes: [
				{
					gridLines: {
						display: false,
						color: 'black'
					},
					scaleLabel: {
						display: true,
						labelString: 'Probability (%)'
					}
				}
			]
		}
	};

	over_under_pdf.data = {
		labels: oe_x,
		datasets: [
			{
				borderColor: '#000000',
				label: `Over Under: ${data['over_under']}`,
				data: oe_y,
				fill: true
			}
		]
	};

	spread_pdf.data = {
		labels: spread_x,
		datasets: [
			{
				borderColor: '#000000',
				label: `Spread: ${data['spread']}`,
				data: spread_y,
				fill: true
			}
		]
	};

	over_under_pdf.options = optionsOE;
	spread_pdf.options = optionsSpread;
	over_under_pdf.update();
	spread_pdf.update();
}
