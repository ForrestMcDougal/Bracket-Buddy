const teamSelect = document.querySelector('#team-select');
const teamGroup = document.querySelector('#tournament-dropdown');
const yearDropdown = document.querySelector('#year-dropdown');
const xAxisDropdown = document.querySelector('#x-axis-dropdown');
const yAxisDropdown = document.querySelector('#y-axis-dropdown');
const teamDropdown = document.querySelector('#team-dropdown');
const teamYearDropdown = document.querySelector('#team-year-dropdown');
const legendSpan = document.querySelector('#legend-selected-team');
const correlation = document.querySelector('#correlation');

YEARS.forEach((year) => {
	let option = document.createElement('option');
	option.text = year;
	option.value = year;
	yearDropdown.insertAdjacentHTML(
		'beforeend',
		`
  <option value="${year}">${year}</option>
`
	);
	teamYearDropdown.insertAdjacentHTML(
		'beforeend',
		`
  <option value="${year}">${year}</option>
`
	);
});

TEAMS.forEach((team) => {
	let option = document.createElement('option');
	option.text = team;
	option.value = team;
	teamDropdown.insertAdjacentHTML(
		'beforeend',
		`
  <option value="${team}">${team}</option>
`
	);
});

yearDropdown.value = '2019';
teamYearDropdown.value = '2019';

teamSelect.addEventListener('change', showGraph);
teamGroup.addEventListener('change', showGraph);
yearDropdown.addEventListener('change', showGraph);

function pearsonCorrelation(independent, dependent) {
	let independent_mean = arithmeticMean(independent);
	let dependent_mean = arithmeticMean(dependent);
	let products_mean = meanOfProducts(independent, dependent);
	let covariance = products_mean - independent_mean * dependent_mean;
	let independent_standard_deviation = standardDeviation(independent);
	let dependent_standard_deviation = standardDeviation(dependent);
	let rho = covariance / (independent_standard_deviation * dependent_standard_deviation);
	return rho;
}

function arithmeticMean(data) {
	let total = 0;
	for (let i = 0, l = data.length; i < l; total += data[i], i++);
	return total / data.length;
}

function meanOfProducts(data1, data2) {
	let total = 0;
	for (let i = 0, l = data1.length; i < l; total += data1[i] * data2[i], i++);
	return total / data1.length;
}

function standardDeviation(data) {
	let squares = [];
	for (let i = 0, l = data.length; i < l; i++) {
		squares[i] = Math.pow(data[i], 2);
	}
	let mean_of_squares = arithmeticMean(squares);
	let mean = arithmeticMean(data);
	let square_of_mean = Math.pow(mean, 2);
	let variance = mean_of_squares - square_of_mean;
	let std_dev = Math.sqrt(variance);
	return std_dev;
}

function xMinMax() {
	xMin = d3.min(theData, (d) => parseFloat(d[curX]) * 0.9);
	xMax = d3.max(theData, (d) => parseFloat(d[curX]) * 1.1);
}

let width = parseInt(d3.select('#scatter').style('width'));
let height = width - width / 3.9 - 100;
let margin = 10;
let labelArea = 200;
let tPadBot = 140;
let tPadLeft = 60;

let svg = d3.select('#scatter').append('svg').attr('width', width).attr('height', height).attr('class', 'chart');

let circRadius;
function crGet() {
	circRadius = width <= 530 ? 3 : 7;
}
crGet();

function axisGeneration() {
	svg.append('g').attr('class', 'xText');
	let xText = d3.select('.xText');

	function xTextRefresh() {
		xText.attr(
			'transform',
			'translate(' + ((width - labelArea) / 2 + labelArea - 40) + ', ' + (height - margin - tPadBot) + ')'
		);
	}
	xTextRefresh();

	let xAxisText = xAxisDropdown.options[xAxisDropdown.selectedIndex].getAttribute('data-label');

	xText
		.append('text')
		.attr('y', -20)
		.attr('data-name', xAxisText)
		.attr('data-axis', 'x')
		.attr('class', 'aText x')
		.text(xAxisText);

	let leftTextX = margin + tPadLeft;
	let leftTextY = (height + labelArea) / 2 - labelArea / 2;

	svg.append('g').attr('class', 'yText');
	let yText = d3.select('.yText');

	function yTextRefresh() {
		yText.attr('transform', 'translate(' + leftTextX + ', ' + leftTextY + ')rotate(-90)');
	}
	yTextRefresh();

	let yAxisText = yAxisDropdown.options[yAxisDropdown.selectedIndex].getAttribute('data-label');

	yText
		.append('text')
		.attr('y', 80)
		.attr('data-name', yAxisText)
		.attr('data-axis', 'y')
		.attr('class', 'aText y')
		.text(yAxisText);
}

function showGraph(e) {
	const searchYear = yearDropdown.value;
	const featureTeam = teamDropdown.value;
	const featureYear = teamYearDropdown.value;
	let svg = document.querySelector('svg');
	svg.innerHTML = '';
	if (featureTeam !== 'none') {
		legendSpan.innerHTML = `<i style="background: #000000; border-radius: 50%">&nbsp&nbsp&nbsp&nbsp</i>${featureYear} ${featureTeam}`;
	} else {
		legendSpan.innerHTML = '';
	}
	axisGeneration();
	d3.json(`/api/scatter/${searchYear}/${featureTeam}/${featureYear}`).then((data) => visualize(data));
}

showGraph();

function visualize(theData) {
	let xAxisValue = xAxisDropdown.options[xAxisDropdown.selectedIndex].value;
	let yAxisValue = yAxisDropdown.options[yAxisDropdown.selectedIndex].value;
	let curX = xAxisValue;
	let curY = yAxisValue;
	let selectedTeams = teamGroup.value;

	if (selectedTeams !== 'all') {
		theData = theData.filter((d) => d[selectedTeams] || d.featured);
	}
	let corrX = theData.map((d) => +d[curX]);
	let corrY = theData.map((d) => +d[curY]);

	let corr = pearsonCorrelation(corrX, corrY);
	correlation.innerHTML = `<h6>Correlation coefficient of ${corr.toFixed(3)}</h6>`;

	let xMin;
	let xMax;
	let yMin;
	let yMax;

	let toolTip = d3.tip().attr('class', 'd3-tip').offset([ 40, -60 ]).html((d) => {
		let teamName = `<div>${d.Season} ${d.TeamName}</div>`;
		let seed = `<div>Seed: ${d.seed || 'None'}</div>`;
		let theX = `<div>${curX}: ${d[curX].toFixed(3)}</div>`;
		let theY = `<div>${curY}: ${d[curY].toFixed(3)}</div>`;
		return teamName + seed + theX + theY;
	});
	svg.call(toolTip);

	function xMinMax() {
		let tempMin1 = d3.min(theData, (d) => parseFloat(d[curX]) * 0.98);
		let tempMin2 = d3.min(theData, (d) => parseFloat(d[curX]) * 1.02);
		let temp = [ tempMin1, tempMin2 ];
		xMin = d3.min(temp, (d) => d);
		xMax = d3.max(theData, (d) => parseFloat(d[curX]) * 1.02);
	}

	function yMinMax() {
		let tempMin1 = d3.min(theData, (d) => parseFloat(d[curY]) * 0.98);
		let tempMin2 = d3.min(theData, (d) => parseFloat(d[curY]) * 1.02);
		let temp = [ tempMin1, tempMin2 ];
		yMin = d3.min(temp, (d) => d);
		yMax = d3.max(theData, (d) => parseFloat(d[curY]) * 1.02);
	}

	xMinMax();
	yMinMax();

	let xScale = d3.scaleLinear().domain([ xMin, xMax ]).range([ margin + labelArea, width - margin ]);
	let yScale = d3.scaleLinear().domain([ yMin, yMax ]).range([ height - margin - labelArea, margin ]);

	let xAxis = d3.axisBottom(xScale);
	let yAxis = d3.axisLeft(yScale);

	function tickCount() {
		if (width <= 500) {
			xAxis.ticks(5);
			yAxis.ticks(5);
		} else {
			xAxis.ticks(10);
			yAxis.ticks(10);
		}
	}
	tickCount();

	svg
		.append('g')
		.call(xAxis)
		.attr('class', 'xAxis')
		.attr('transform', `translate(0, ${height - margin - labelArea})`);
	svg.append('g').call(yAxis).attr('class', 'yAxis').attr('transform', `translate(${margin + labelArea}, 0)`);

	let theCircles = svg.selectAll('g theCircles').data(theData).enter();

	theCircles
		.append('circle')
		.attr('cx', (d) => xScale(d[curX]))
		.attr('cy', (d) => yScale(d[curY]))
		.attr('r', circRadius)
		.attr('class', (d) => `teamCircle ${d.TeamName}`)
		.attr('fill', (d) => {
			if (d.featured === true) {
				return '#000000';
			} else if (d.Champion === true) {
				return '#FFFF00';
			} else if (d.FinalFour === true) {
				return '#ADFF2F';
			} else if (d.seed) {
				return '#ff7f7f';
			} else {
				return '#89bdd3';
			}
		})
		.attr('opacity', 0.8)
		.on('mouseover', function(d) {
			toolTip.show(d, this);
			d3.select(this).style('stroke', '#323232');
		})
		.on('mouseout', function(d) {
			toolTip.hide(d);
			d3.select(this).style('stroke', '#e3e3e3');
		});

	d3.select(window).on('resize', resize);

	d3.select('#x-axis-dropdown').on('change', function() {
		curX = xAxisDropdown.value;
		xMinMax();
		xScale.domain([ xMin, xMax ]);
		svg.select('.xAxis').transition().duration(300).call(xAxis);
		d3.selectAll('circle').each(function() {
			d3
				.select(this)
				.transition()
				.attr('cx', function(d) {
					return xScale(d[curX]);
				})
				.duration(300);
		});
		d3.selectAll('.teamText').each(function() {
			d3
				.select(this)
				.transition()
				.attr('dx', function(d) {
					return xScale(d[curX]);
				})
				.duration(300);
		});
		let xAxisText = xAxisDropdown.options[xAxisDropdown.selectedIndex].getAttribute('data-label');
		let xText = d3.select('.xText');
		xText.remove();
		svg.append('g').attr('class', 'xText');
		xText = d3.select('.xText');
		function xTextRefresh() {
			xText.attr(
				'transform',
				'translate(' + ((width - labelArea) / 2 + labelArea - 40) + ', ' + (height - margin - tPadBot) + ')'
			);
		}
		xTextRefresh();
		xText
			.append('text')
			.attr('y', -20)
			.attr('data-name', xAxisText)
			.attr('data-axis', 'x')
			.attr('class', 'aText x')
			.text(xAxisText);
		let corrX = theData.map((d) => +d[curX]);
		let corrY = theData.map((d) => +d[curY]);

		let corr = pearsonCorrelation(corrX, corrY);
		correlation.innerHTML = `<h6>Correlation coefficient of ${corr.toFixed(3)}</h6>`;
	});

	d3.select('#y-axis-dropdown').on('change', function() {
		curY = yAxisDropdown.value;
		yMinMax();
		yScale.domain([ yMin, yMax ]);
		svg.select('.yAxis').transition().duration(300).call(yAxis);
		d3.selectAll('circle').each(function() {
			d3
				.select(this)
				.transition()
				.attr('cy', function(d) {
					return yScale(d[curY]);
				})
				.duration(300);
		});
		d3.selectAll('.teamText').each(function() {
			d3
				.select(this)
				.transition()
				.attr('dy', function(d) {
					return yScale(d[curY]);
				})
				.duration(300);
		});
		let yAxisText = yAxisDropdown.options[yAxisDropdown.selectedIndex].getAttribute('data-label');
		let yText = d3.select('.yText');
		yText.remove();
		svg.append('g').attr('class', 'yText');
		yText = d3.select('.yText');
		let leftTextX = margin + tPadLeft;
		let leftTextY = (height + labelArea) / 2 - labelArea / 2;
		function yTextRefresh() {
			yText.attr('transform', 'translate(' + leftTextX + ', ' + leftTextY + ')rotate(-90)');
		}
		yTextRefresh();
		yText
			.append('text')
			.attr('y', 80)
			.attr('data-name', yAxisText)
			.attr('data-axis', 'y')
			.attr('class', 'aText y')
			.text(yAxisText);
		let corrX = theData.map((d) => +d[curX]);
		let corrY = theData.map((d) => +d[curY]);

		let corr = pearsonCorrelation(corrX, corrY);
		correlation.innerHTML = `<h6>Correlation coefficient of ${corr.toFixed(3)}</h6>`;
	});

	function resize() {
		let width = parseInt(d3.select('#scatter').style('width'));
		let height = width - width / 3.9 - 100;

		svg.attr('width', width).attr('height', height);

		xScale.range([ margin + labelArea, width - margin ]);
		yScale.range([ height - margin - labelArea, margin ]);

		svg.select('.xAxis').call(xAxis).attr('transform', `translate(0, ${height - margin - labelArea})`);

		svg.select('.yAxis').call(yAxis);

		tickCount();

		let xText = d3.select('.xText');
		let yText = d3.select('.yText');
		let leftTextX = margin + tPadLeft;
		let leftTextY = (height + labelArea) / 2 - labelArea / 2;

		function xTextRefreshResize() {
			xText.attr(
				'transform',
				'translate(' + ((width - labelArea) / 2 + labelArea) + ', ' + (height - margin - tPadBot) + ')'
			);
		}

		function yTextRefreshResize() {
			yText.attr('transform', 'translate(' + leftTextX + ', ' + leftTextY + ')rotate(-90)');
		}

		xTextRefreshResize();
		yTextRefreshResize();

		crGet();

		d3
			.selectAll('circle')
			.attr('cy', (d) => yScale(d[curY]))
			.attr('cx', (d) => xScale(d[curX]))
			.attr('r', circRadius);

		d3
			.selectAll('.teamText')
			.attr('dy', (d) => yScale(d[curY]) + circRadius / 3)
			.attr('dx', (d) => xScale(d[curX]))
			.attr('r', circRadius / 3);
	}
}
