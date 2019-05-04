let over_under_pdf;
let spread_pdf;

function makePDFsInit(ctxOU, ctxSpread) {
	let homeTeam = homeTeamDropdown.value;
	let homeYear = homeYearDropdown.value;
	let awayTeam = awayTeamDropdown.value;
	let awayYear = awayYearDropdown.value;
	d3.json(`/api/predictions/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`).then((data) => {
		let spread_x = data['spread_x'].map((d) => +d);
		let spread_y = data['spread_y'].map((d) => +d);
		let oe_x = data['over_under_x'].map((d) => +d);
		let oe_y = data['over_under_y'].map((d) => +d);

		let minSpread = Math.min(...spread_x).toFixed(0) - 1;
		let maxSpread = Math.max(...spread_x).toFixed(0) + 1;
		let minOE = Math.min(...oe_x).toFixed(0) - 1;
		let maxOE = Math.max(...oe_x).toFixed(0) + 1;

		let optionsSpread = {
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
							stepWidth: 10,
							maxTicksLimit: 10,
							precision: 0,
							maxRotation: 0
						}
					}
				],
				yAxes: [
					{
						gridLines: {
							display: false,
							color: 'black'
						}
					}
				]
			}
		};

		let optionsOE = {
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
							stepWidth: 10,
							maxTicksLimit: 10,
							precision: 0,
							maxRotation: 0
						}
					}
				],
				yAxes: [
					{
						gridLines: {
							display: false,
							color: 'black'
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
						label: 'Over Under',
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
						label: 'Spread',
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
						stepWidth: 10,
						maxTicksLimit: 10,
						precision: 0,
						maxRotation: 0
					}
				}
			],
			yAxes: [
				{
					gridLines: {
						display: false,
						color: 'black'
					}
				}
			]
		}
	};

	let optionsOE = {
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
						stepWidth: 10,
						maxTicksLimit: 10,
						precision: 0,
						maxRotation: 0
					}
				}
			],
			yAxes: [
				{
					gridLines: {
						display: false,
						color: 'black'
					}
				}
			]
		}
	};

	over_under_pdf.data = {
		labels: oe_x,
		datasets: [
			{
				label: 'Over Under',
				data: oe_y,
				fill: true
			}
		]
	};

	spread_pdf.data = {
		labels: spread_x,
		datasets: [
			{
				label: 'Spread',
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
