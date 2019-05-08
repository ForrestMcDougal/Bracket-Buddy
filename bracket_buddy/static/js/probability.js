let over_under_pdf;
let spread_pdf;

function makePDFsInit(ctxOU, ctxSpread) {
	over_under_pdf = new Chart(ctxOU, {
		type: 'line'
	});

	spread_pdf = new Chart(ctxSpread, {
		type: 'line'
	});
}

function makePDFs(data) {
	let spread_x = data['spread_x'].map((d) => +d);
	let spread_y = data['spread_y'].map((d) => +d);
	let oe_x = data['over_under_x'].map((d) => +d);
	let oe_y = data['over_under_y'].map((d) => +d);
	let fillColors = data['spread_colors'].map((d) => d);

	let minSpread = +data['spread_bounds'][0];
	let maxSpread = +data['spread_bounds'][1];
	let minOE = Math.min(...oe_x).toFixed(0) - 1;
	let maxOE = Math.max(...oe_x).toFixed(0) + 1;

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
				pointBackgroundColor: fillColors,
				borderColor: '#000000',
				label: `Spread: ${data['spread']}`,
				data: spread_y,
				fill: true
			}
		]
	};

	over_under_pdf.options = makeOptionsOE(oe_y, minOE, maxOE);
	spread_pdf.options = makeOptionsSpread(spread_y, minSpread, maxSpread);
	over_under_pdf.update();
	spread_pdf.update();
}

function makeOptionsSpread(spread_y, minSpread, maxSpread) {
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
						maxRotation: 90
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
	return optionsSpread;
}

function makeOptionsOE(oe_y, minOE, maxOE) {
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
						maxRotation: 90
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
	return optionsOE;
}
