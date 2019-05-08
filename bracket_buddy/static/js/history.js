let historyChart;

function makeHistoryChartInit(chart) {
	historyChart = new Chart(chart, {
		type: 'line'
	});
}

function makeHistoryChart(data) {
	let years = [ 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019 ];
	let stat = historyFilter.value;
	let yVal = data.map((d) => d[stat]);
	let label = historyFilter.options[historyFilter.selectedIndex].getAttribute('data-label');

	historyChart.data = {
		labels: years,
		datasets: [
			{
				label: label,
				data: yVal,
				borderColor: data[0]['color1'],
				fill: true,
				backgroundColor: data[0]['color2']
			}
		]
	};
	historyChart.options = makeHistoryChartOptions();
	historyChart.update();
}

function makeHistoryChartOptions() {
	let options = {
		tooltips: {
			callbacks: {
				label: function(tooltipItem) {
					return `${Number(tooltipItem.yLabel).toFixed(2)}`;
				}
			}
		}
	};
	return options;
}
