let oDoughnut;
let dDoughnut;
let homeODoughnut;
let awayODoughnut;
let homeDDoughnut;
let awayDDoughnut;

function makeDoughnutsInit(ctxO, ctxD) {
	let selTeam = teamDropdown.value;
	let selYear = teamYearDropdown.value;
	d3.json(`/api/team/year/${selTeam}/${selYear}`).then((data) => {
		let oData = [];
		oData.push(data[0]['OFF_2PT'].toFixed(1));
		oData.push(data[0]['OFF_3PT'].toFixed(1));
		oData.push(data[0]['OFF_FT'].toFixed(1));
		let dData = [];
		dData.push(data[0]['DEF_2PT'].toFixed(1));
		dData.push(data[0]['DEF_3PT'].toFixed(1));
		dData.push(data[0]['DEF_FT'].toFixed(1));

		let labels = [ '2PT FG Rate', '3PT FG Rate', 'FT Rate' ];

		let dataOffense = {
			labels: labels,
			datasets: [
				{
					label: 'Offensive',
					data: oData,
					backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
					borderColor: [ '#000000', '#000000', '#000000' ],
					borderWidth: [ 1, 1, 1 ]
				}
			]
		};

		let oOptions = {
			responsive: true,
			title: {
				display: true,
				position: 'top',
				text: 'Offense',
				fontSize: 18,
				fontColor: '#111'
			},
			legend: {
				display: false
			}
		};

		oDoughnut = new Chart(ctxO, {
			type: 'doughnut',
			data: dataOffense,
			options: oOptions
		});

		let dataDefense = {
			labels: labels,
			datasets: [
				{
					label: 'Defensive',
					data: dData,
					backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
					borderColor: [ '#000000', '#000000', '#000000' ],
					borderWidth: [ 1, 1, 1 ]
				}
			]
		};

		let dOptions = {
			responsive: true,
			title: {
				display: true,
				position: 'top',
				text: 'Defense',
				fontSize: 18,
				fontColor: '#111'
			},
			legend: {
				display: false
			}
		};

		dDoughnut = new Chart(ctxD, {
			type: 'doughnut',
			data: dataDefense,
			options: dOptions
		});
	});
}

function makeDoughnuts(data) {
	let oData = [];
	oData.push(data[0]['OFF_2PT'].toFixed(1));
	oData.push(data[0]['OFF_3PT'].toFixed(1));
	oData.push(data[0]['OFF_FT'].toFixed(1));
	let dData = [];
	dData.push(data[0]['DEF_2PT'].toFixed(1));
	dData.push(data[0]['DEF_3PT'].toFixed(1));
	dData.push(data[0]['DEF_FT'].toFixed(1));

	let labels = [ '2PT FG Rate', '3PT FG Rate', 'FT Rate' ];

	let dataOffense = {
		labels: labels,
		datasets: [
			{
				label: 'Offensive',
				data: oData,
				backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
				borderColor: [ '#ff0000', '#0000ff', '#008000' ],
				borderWidth: [ 1, 1, 1 ]
			}
		]
	};

	oDoughnut.data = dataOffense;
	oDoughnut.update();

	let dataDefense = {
		labels: labels,
		datasets: [
			{
				label: 'Defensive',
				data: dData,
				backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
				borderColor: [ '#ff0000', '#0000ff', '#008000' ],
				borderWidth: [ 1, 1, 1 ]
			}
		]
	};

	dDoughnut.data = dataDefense;
	dDoughnut.update();
}

function makeDoughnutsCompareInit(ctxHomeO, ctxHomeD, ctxAwayO, ctxAwayD) {
	let homeTeam = homeTeamDropdown.value;
	let homeYear = homeYearDropdown.value;
	let awayTeam = awayTeamDropdown.value;
	let awayYear = awayYearDropdown.value;
	d3.json(`/api/barDouble/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`).then((data) => {
		let homeOData = [];
		homeOData.push(data[0]['OFF_2PT'].toFixed(1));
		homeOData.push(data[0]['OFF_3PT'].toFixed(1));
		homeOData.push(data[0]['OFF_FT'].toFixed(1));
		let homeDData = [];
		homeDData.push(data[0]['DEF_2PT'].toFixed(1));
		homeDData.push(data[0]['DEF_3PT'].toFixed(1));
		homeDData.push(data[0]['DEF_FT'].toFixed(1));
		let awayOData = [];
		awayOData.push(data[1]['OFF_2PT'].toFixed(1));
		awayOData.push(data[1]['OFF_3PT'].toFixed(1));
		awayOData.push(data[1]['OFF_FT'].toFixed(1));
		let awayDData = [];
		awayDData.push(data[1]['DEF_2PT'].toFixed(1));
		awayDData.push(data[1]['DEF_3PT'].toFixed(1));
		awayDData.push(data[1]['DEF_FT'].toFixed(1));

		let labels = [ '2PT FG Rate', '3PT FG Rate', 'FT Rate' ];

		let dataHomeOffense = {
			labels: labels,
			datasets: [
				{
					label: 'Offensive',
					data: homeOData,
					backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
					borderColor: [ '#000000', '#000000', '#000000' ],
					borderWidth: [ 1, 1, 1 ]
				}
			]
		};

		let options = {
			responsive: true,
			legend: {
				display: true
			}
		};

		homeODoughnut = new Chart(ctxHomeO, {
			type: 'doughnut',
			data: dataHomeOffense,
			options: options
		});

		let dataHomeDefense = {
			labels: labels,
			datasets: [
				{
					label: 'Defensive',
					data: homeDData,
					backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
					borderColor: [ '#000000', '#000000', '#000000' ],
					borderWidth: [ 1, 1, 1 ]
				}
			]
		};

		homeDDoughnut = new Chart(ctxHomeD, {
			type: 'doughnut',
			data: dataHomeDefense,
			options: options
		});

		let dataAwayOffense = {
			labels: labels,
			datasets: [
				{
					label: 'Offensive',
					data: awayOData,
					backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
					borderColor: [ '#000000', '#000000', '#000000' ],
					borderWidth: [ 1, 1, 1 ]
				}
			]
		};

		awayODoughnut = new Chart(ctxAwayO, {
			type: 'doughnut',
			data: dataAwayOffense,
			options: options
		});

		let dataAwayDefense = {
			labels: labels,
			datasets: [
				{
					label: 'Defensive',
					data: awayDData,
					backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
					borderColor: [ '#000000', '#000000', '#000000' ],
					borderWidth: [ 1, 1, 1 ]
				}
			]
		};

		awayDDoughnut = new Chart(ctxAwayD, {
			type: 'doughnut',
			data: dataAwayDefense,
			options: options
		});
	});
}

function makeDoughnutsCompare(data) {
	let homeOData = [];
	homeOData.push(data[0]['OFF_2PT'].toFixed(1));
	homeOData.push(data[0]['OFF_3PT'].toFixed(1));
	homeOData.push(data[0]['OFF_FT'].toFixed(1));
	let homeDData = [];
	homeDData.push(data[0]['DEF_2PT'].toFixed(1));
	homeDData.push(data[0]['DEF_3PT'].toFixed(1));
	homeDData.push(data[0]['DEF_FT'].toFixed(1));
	let awayOData = [];
	awayOData.push(data[1]['OFF_2PT'].toFixed(1));
	awayOData.push(data[1]['OFF_3PT'].toFixed(1));
	awayOData.push(data[1]['OFF_FT'].toFixed(1));
	let awayDData = [];
	awayDData.push(data[1]['DEF_2PT'].toFixed(1));
	awayDData.push(data[1]['DEF_3PT'].toFixed(1));
	awayDData.push(data[1]['DEF_FT'].toFixed(1));

	let labels = [ '2PT FG Rate', '3PT FG Rate', 'FT Rate' ];

	let dataHomeOffense = {
		labels: labels,
		datasets: [
			{
				label: 'Offensive',
				data: homeOData,
				backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
				borderColor: [ '#000000', '#000000', '#000000' ],
				borderWidth: [ 1, 1, 1 ]
			}
		]
	};

	homeODoughnut.data = dataHomeOffense;
	homeODoughnut.update();

	let dataHomeDefense = {
		labels: labels,
		datasets: [
			{
				label: 'Defensive',
				data: homeDData,
				backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
				borderColor: [ '#000000', '#000000', '#000000' ],
				borderWidth: [ 1, 1, 1 ]
			}
		]
	};

	homeDDoughnut.data = dataHomeDefense;
	homeDDoughnut.update();

	let dataAwayOffense = {
		labels: labels,
		datasets: [
			{
				label: 'Offensive',
				data: awayOData,
				backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
				borderColor: [ '#000000', '#000000', '#000000' ],
				borderWidth: [ 1, 1, 1 ]
			}
		]
	};

	awayODoughnut.data = dataAwayOffense;
	awayODoughnut.update();

	let dataAwayDefense = {
		labels: labels,
		datasets: [
			{
				label: 'Defensive',
				data: awayDData,
				backgroundColor: [ '#ff0000', '#0000ff', '#008000' ],
				borderColor: [ '#000000', '#000000', '#000000' ],
				borderWidth: [ 1, 1, 1 ]
			}
		]
	};

	awayDDoughnut.data = dataAwayDefense;
	awayDDoughnut.update();
}
