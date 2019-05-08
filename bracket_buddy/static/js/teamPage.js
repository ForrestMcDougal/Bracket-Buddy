// select elements from DOM
let teamDropdown = document.querySelector('#team-dropdown');
let teamYearDropdown = document.querySelector('#team-year-dropdown');
let ctxBar = document.querySelector('#teamBar');
let ctxHistory = document.querySelector('#teamHistory');
let ctxODoughnut = document.querySelector('#teamODoughnut');
let ctxDDoughnut = document.querySelector('#teamDDoughnut');
let ctxFFRadar = document.querySelector('#teamFourFactorsRadar');
let ctxRankingRadar = document.querySelector('#rankRadar');
let teamChange = document.querySelector('#change-team');
let historyFilter = document.querySelector('#history-filter');

// populate select options
YEARS.forEach((year) => {
	let option = document.createElement('option');
	option.text = year;
	option.value = year;
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

teamYearDropdown.value = '2019';
teamDropdown.value = 'Duke';

// initialize charts
makeHistoryChartInit(ctxHistory);
makeBarChartInit(ctxBar);
makeDoughnutsInit(ctxODoughnut, ctxDDoughnut);
makeRadarFourFactorsInit(ctxFFRadar);
makeRadarRankInit(ctxRankingRadar);

// populate initial charts
let selTeam = teamDropdown.value;
let selYear = teamYearDropdown.value;
d3.json(`/api/barSingle/${selTeam}/${selYear}`).then((data) => makeBarChart(data, selTeam));
d3.json(`/api/team/${selTeam}`).then((data) => makeHistoryChart(data));
d3.json(`/api/team/year/${selTeam}/${selYear}`).then((data) => {
	makeDoughnuts(data);
	makeRadarRank(data);
});
d3.json(`/api/radar/${selTeam}/${selYear}`).then((data) => makeRadarFourFactors(data, selTeam, selYear));

// add event listeners for change
teamChange.addEventListener('change', showPage);

historyFilter.addEventListener('change', () => {
	let selTeam = teamDropdown.value;
	d3.json(`/api/team/${selTeam}`).then((data) => makeHistoryChart(data));
});

// on change, change all charts
function showPage() {
	let selTeam = teamDropdown.value;
	let selYear = teamYearDropdown.value;
	d3.json(`/api/barSingle/${selTeam}/${selYear}`).then((data) => makeBarChart(data, selTeam));
	d3.json(`/api/team/${selTeam}`).then((data) => makeHistoryChart(data));
	d3.json(`/api/team/year/${selTeam}/${selYear}`).then((data) => {
		makeDoughnuts(data);
		makeRadarRank(data);
	});
	d3.json(`/api/radar/${selTeam}/${selYear}`).then((data) => makeRadarFourFactors(data, selTeam, selYear));
}
