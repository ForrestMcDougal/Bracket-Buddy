// grab elements from DOM
let homeTeamDropdown = document.querySelector('#home-team-dropdown');
let homeYearDropdown = document.querySelector('#home-year-dropdown');
let awayTeamDropdown = document.querySelector('#away-team-dropdown');
let awayYearDropdown = document.querySelector('#away-year-dropdown');
let ctxDoubleBar = document.querySelector('#doubleBar');
let ctxFFHome = document.querySelector('#homeRadarFF');
let ctxRadarRankHome = document.querySelector('#homeRadarRank');
let ctxOverUnderPDF = document.querySelector('#overUnderPDF');
let ctxSpreadPDF = document.querySelector('#spreadPDF');
let teamChange = document.querySelector('#change-team');
let scatterChart = document.querySelector('#mlScatter');
var winBarChart = document.querySelector('#winBar');
let homeTeamNameSpan = document.querySelector('#homeTeamName');
let awayTeamNameSpan = document.querySelector('#awayTeamName');
let homeTeamScoreSpan = document.querySelector('#homeTeamScore');
let awayTeamScoreSpan = document.querySelector('#awayTeamScore');

// populate select options
YEARS.forEach((year) => {
	let option = document.createElement('option');
	option.text = year;
	option.value = year;
	homeYearDropdown.insertAdjacentHTML(
		'beforeend',
		`
  <option value="${year}">${year}</option>
`
	);
	awayYearDropdown.insertAdjacentHTML(
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
	homeTeamDropdown.insertAdjacentHTML(
		'beforeend',
		`
  <option value="${team}">${team}</option>
`
	);
	awayTeamDropdown.insertAdjacentHTML(
		'beforeend',
		`
  <option value="${team}">${team}</option>
`
	);
});

homeYearDropdown.value = '2019';
awayYearDropdown.value = '2019';
homeTeamDropdown.value = 'Duke';
awayTeamDropdown.value = 'North Carolina';

// initialize charts
makeDoubleBarChartInit(ctxDoubleBar);
makeRadarRankCompareInit(ctxRadarRankHome);
makeRadarFourFactorsComparisonInit(ctxFFHome);
makeMLScatterInit(scatterChart);
makePDFsInit(ctxOverUnderPDF, ctxSpreadPDF);
makeWinBarInit(winBarChart);

// initial population of charts
let homeTeam = homeTeamDropdown.value;
let homeYear = homeYearDropdown.value;
let awayTeam = awayTeamDropdown.value;
let awayYear = awayYearDropdown.value;
d3.json(`/api/barDouble/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`).then((data) => {
	makeDoubleBarChart(data, homeTeam, homeYear, awayTeam, awayYear);
	makeRadarRankCompare(data, homeTeam, awayTeam);
});
d3
	.json(`/api/radar/compare/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`)
	.then((data) => makeRadarFourFactorsComparison(data, homeTeam, homeYear, awayTeam, awayYear));
d3.json(`/api/predictions/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`).then((data) => {
	homeTeamNameSpan.innerHTML = `${homeYear} ${homeTeam}`;
	awayTeamNameSpan.innerHTML = `${awayYear} ${awayTeam}`;
	homeTeamScoreSpan.innerHTML = `${data['home_point_prediction']}`;
	awayTeamScoreSpan.innerHTML = `${data['away_point_prediction']}`;
	makeMLScatter(data, homeTeam, homeYear, awayTeam, awayYear);
	makePDFs(data);
	makeWinBar(data, homeYear, homeTeam, awayYear, awayTeam);
});

// add event listener for change
teamChange.addEventListener('change', showPage);

// on change, change all charts
function showPage() {
	let homeTeam = homeTeamDropdown.value;
	let homeYear = homeYearDropdown.value;
	let awayTeam = awayTeamDropdown.value;
	let awayYear = awayYearDropdown.value;
	d3.json(`/api/barDouble/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`).then((data) => {
		makeDoubleBarChart(data, homeTeam, homeYear, awayTeam, awayYear);
		makeRadarRankCompare(data, homeTeam, awayTeam);
	});
	d3
		.json(`/api/radar/compare/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`)
		.then((data) => makeRadarFourFactorsComparison(data, homeTeam, homeYear, awayTeam, awayYear));
	d3.json(`/api/predictions/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`).then((data) => {
		homeTeamNameSpan.innerHTML = `${homeYear} ${homeTeam}`;
		awayTeamNameSpan.innerHTML = `${awayYear} ${awayTeam}`;
		homeTeamScoreSpan.innerHTML = `${data['home_point_prediction']}`;
		awayTeamScoreSpan.innerHTML = `${data['away_point_prediction']}`;
		makeMLScatter(data, homeTeam, homeYear, awayTeam, awayYear);
		makePDFs(data);
		makeWinBar(data, homeYear, homeTeam, awayYear, awayTeam);
	});
}
