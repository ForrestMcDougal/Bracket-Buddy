const filters = document.querySelector('#filters');
filters.addEventListener('change', showGraph);

const xAxisDropdown = document.querySelector('#x-axis-dropdown');
const yAxisDropdown = document.querySelector('#y-axis-dropdown');

let width = parseInt(d3.select('#scatter').style('width'));
let height = width - width / 3.9;
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
			'translate(' + ((width - labelArea) / 2 + labelArea) + ', ' + (height - margin - tPadBot) + ')'
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
	const searchYear = document.getElementById('year-dropdown').value;
	let svg = document.querySelector('svg');
	svg.innerHTML = '';
	axisGeneration();
	d3.json(`/api/year/${searchYear}`).then((data) => visualize(data));
}

showGraph();

function visualize(theData) {
	let xAxisValue = xAxisDropdown.options[xAxisDropdown.selectedIndex].value;
	let yAxisValue = yAxisDropdown.options[yAxisDropdown.selectedIndex].value;
	let curX = xAxisValue;
	let curY = yAxisValue;
	let selectedTeams = document.querySelector('#tournament-dropdown').value;

	if (selectedTeams !== 'all') {
		theData = theData.filter((d) => d[selectedTeams]);
	}

	let xMin;
	let xMax;
	let yMin;
	let yMax;

	let toolTip = d3.tip().attr('class', 'd3-tip').offset([ 40, -60 ]).html((d) => {
		let teamName = `<div>${d.TeamName}</div>`;
		let theX = `<div>${curX}: ${d[curX].toFixed(3)}</div>`;
		let theY = `<div>${curY}: ${d[curY].toFixed(3)}</div>`;
		return teamName + theX + theY;
	});
	svg.call(toolTip);

	function xMinMax() {
		xMin = d3.min(theData, (d) => parseFloat(d[curX]) * 0.98);
		xMax = d3.max(theData, (d) => parseFloat(d[curX]) * 1.02);
	}

	function yMinMax() {
		yMin = d3.min(theData, (d) => parseFloat(d[curY]) * 0.98);
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
			if (d.Champion === true) {
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

	function resize() {
		width = parseInt(d3.select('#scatter').style('width'));
		height = width - width / 3.9;
		leftTextY = (height + labelArea) / 2 - labelArea;

		svg.attr('width', width).attr('height', height);

		xScale.range([ margin + labelArea, width - margin ]);
		yScale.range([ height - margin - labelArea, margin ]);

		svg.select('.xAxis').call(xAxis).attr('transform', `translate(0, ${height - margin - labelArea})`);

		svg.select('.yAxis').call(yAxis);

		tickCount();

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
