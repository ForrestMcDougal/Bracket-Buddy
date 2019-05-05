let htDdl = d3.select('#home-team-dropdown');
let hyDdl = d3.select('#home-year-dropdown');
let atDdl = d3.select('#away-team-dropdown');
let ayDdl = d3.select('#away-year-dropdown');

// $('.radio-select').on('change', function(event) {
// TODO ADD RADIO SELECT FOR NEUTRAL/HOME/AWAY
// });

function init() {
  // Grab a reference to the dropdown select element
  // var title = d3.select("#stageInfo");
  // title.text("Stage 1 Results")
  // TODO Populate a div with the selected teams

	// Set the default values

	let defT1 = "Virginia";
	let defY1 = "2019";
	let defT2 = "Texas Tech";
	let defY2 = "2019";
	// Populate the drop down lists
  d3.json("/api/team").then((data) => {

    data.forEach((item) => {
			if (item==defT1){
			htDdl
			.append("option")
			.text(item)
			.property("value", item)
			.attr('selected', true);
		}
			if (item==defT2){
			atDdl
			.append("option")
			.text(item)
			.property("value", item)
			.attr('selected', true);
		}
			else {
      htDdl
        .append("option")
        .text(item)
        .property("value", item);
			atDdl
			.append("option")
			.text(item)
			.property("value", item);
		}
	  });
		d3.json("/api/year/").then((data) => {
	    data.forEach((item) => {
				if (item==defY1){
				hyDdl
				.append("option")
				.text(item)
				.property("value", item)
				.attr('selected', true);
			}
				if (item==defY2){
				ayDdl
				.append("option")
				.text(item)
				.property("value", item)
				.attr('selected', true);
			}
				else {
	      hyDdl
	        .append("option")
	        .text(item)
	        .property("value", item);
				ayDdl
				.append("option")
				.text(item)
				.property("value", item);
			}
	    });
	  });
	});
	// showPage()
}

window.onload = function () {
  init();
};
