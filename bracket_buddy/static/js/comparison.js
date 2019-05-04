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

teamChange.addEventListener('change', showPage);

makeDoubleBarChartInit(ctxDoubleBar);
makeRadarRankCompareInit(ctxRadarRankHome);
makeRadarFourFactorsComparisonInit(ctxFFHome);
makePDFsInit(ctxOverUnderPDF, ctxSpreadPDF);

function showPage() {
	let homeTeam = homeTeamDropdown.value;
	let homeYear = homeYearDropdown.value;
	let awayTeam = awayTeamDropdown.value;
	let awayYear = awayYearDropdown.value;
	d3.json(`/api/barDouble/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`).then((data) => {
		makeDoubleBarChart(data, homeTeam, homeYear, awayTeam, awayYear);
		makeRadarRankCompare(data);
	});
	d3
		.json(`/api/radar/compare/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`)
		.then((data) => makeRadarFourFactorsComparison(data, homeTeam, homeYear, awayTeam, awayYear));
	d3.json(`/api/predictions/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`).then((data) => makePDFs(data));
}
