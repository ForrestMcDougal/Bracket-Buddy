let homeTeamDropdown = document.querySelector('#home-team-dropdown');
let homeYearDropdown = document.querySelector('#home-year-dropdown');
let awayTeamDropdown = document.querySelector('#away-team-dropdown');
let awayYearDropdown = document.querySelector('#away-year-dropdown');
let ctxDoubleBar = document.querySelector('#doubleBar');
let ctxFFHome = document.querySelector('#homeRadarFF');
let ctxFFAway = document.querySelector('#awayRadarFF');
let ctxRadarRankHome = document.querySelector('#homeRadarRank');
let ctxRadarRankAway = document.querySelector('#awayRadarRank');
let ctxHomeODoughnut = document.querySelector('#homeODonut');
let ctxAwayODoughnut = document.querySelector('#awayODonut');
let ctxHomeDDoughnut = document.querySelector('#homeDDonut');
let ctxAwayDDoughnut = document.querySelector('#awayDDonut');
let teamChange = document.querySelector('#change-team');

teamChange.addEventListener('change', showPage);

makeDoubleBarChartInit(ctxDoubleBar);
makeRadarRankCompareInit(ctxRadarRankHome, ctxRadarRankAway);
makeRadarFourFactorsComparisonInit(ctxFFHome, ctxFFAway);
makeDoughnutsCompareInit(ctxHomeODoughnut, ctxHomeDDoughnut, ctxAwayODoughnut, ctxAwayDDoughnut);

function showPage() {
	let homeTeam = homeTeamDropdown.value;
	let homeYear = homeYearDropdown.value;
	let awayTeam = awayTeamDropdown.value;
	let awayYear = awayYearDropdown.value;
	d3.json(`/api/barDouble/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`).then((data) => {
		makeDoubleBarChart(data, homeTeam, homeYear, awayTeam, awayYear);
		makeRadarRankCompare(data);
		makeDoughnutsCompare(data);
	});
	d3
		.json(`/api/radar/compare/${selTeamHome}/${selYearHome}/${selTeamAway}/${selYearAway}`)
		.then((data) => makeRadarFourFactorsComparison(data, homeTeam, homeYear, awayTeam, awayYear));
}
