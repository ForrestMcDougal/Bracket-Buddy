let teamDropdown = document.querySelector('#team-dropdown');
let teamYearDropdown = document.querySelector('#team-year-dropdown');
let ctxBar = document.querySelector('#teamBar');
let ctxHistory = document.querySelector('#teamHistory');
let teamChange = document.querySelector('#change-team');
let historyFilter = document.querySelector('#history-filter');

teamChange.addEventListener('change', showPage);

historyFilter.addEventListener('change', () => {
	let selTeam = teamDropdown.value;
	d3.json(`/api/team/${selTeam}`).then((data) => makeHistoryChart(data));
});

makeHistoryChartInit(ctxHistory);
makeBarChartInit(ctxBar);

function showPage() {
	let selTeam = teamDropdown.value;
	let selYear = teamYearDropdown.value;
	d3.json(`/api/barSingle/${selTeam}/${selYear}`).then((data) => makeBarChart(data, selTeam));
	d3.json(`/api/team/${selTeam}`).then((data) => makeHistoryChart(data));
}
