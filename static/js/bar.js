// var ctx = document.getElementById("myChart").getContext('2d');
//   var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: ["OE", "DE", "Tempo", "Size", "Exp"],
//       datasets: [{
//           label: 'Team1',
//           data: [12, 19, 3, 17, 28],
//           backgroundColor: "rgba(153,255,51,1)"
//       }, {
//           label: 'Team2',
//           data: [30, 29, 5, 5, 20],
//           backgroundColor: "rgba(255,153,0,1)"
//       }]
//   }
// });



// const url = "/api/all";

// // Fetch the JSON data and console log it
// d3.json(url).then(function(data) {
//   console.log(data);
// });

// function buildMetadata(sample) {
//   d3.json(`/metadata/${sample}`).then((data) => {
//     // Use d3 to select the panel with id of `#sample-metadata`
//     var PANEL = d3.select("#sample-metadata");

//     // Use `.html("") to clear any existing metadata
//     PANEL.html("");

//     // Use `Object.entries` to add each key and value pair to the panel
//     // Hint: Inside the loop, you will need to use d3 to append new
//     // tags for each key-value in the metadata.
//     Object.entries(data).forEach(([key, value]) => {
//       PANEL.append("h6").text(`${key}: ${value}`);
//     });
//   });
// }


function showBar() {
  // let selTeam = teamDropdown.value;
  // let selYear = teamYearDropdown.value;
  let selTeam1 = 'Duke';
  let selYear1 = 2019;
  let selTeam2 = 'North Carolina';
  let selYear2 = 2017;
  d3.json(`/api/barDouble/${selTeam1}/${selYear1}/${selTeam2}/${selYear2}`).then((data) => getBarData(data));
}

showBar();

function getBarData(data) {
  let rankData1 = [];
  let rankData2 = [];

  // offensive
  rankData1.push(data[0]['norm_ADJ_EM']);
  rankData1.push(data[0]['norm_OE']);
  rankData1.push(data[0]['norm_DE']);
  rankData1.push(data[0]['norm_Tempo']);
  rankData1.push(data[0]['norm_Exp']);
  rankData1.push(data[0]['norm_Size']);

  rankData2.push(data[1]['norm_ADJ_EM']);
  rankData2.push(data[1]['norm_OE']);
  rankData2.push(data[1]['norm_DE']);
  rankData2.push(data[1]['norm_Tempo']);
  rankData2.push(data[1]['norm_Exp']);
  rankData2.push(data[1]['norm_Size']);

  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Adj EM', 'OE', 'DE', 'Tempo', 'Exp', 'Size'],
      datasets: [{
          label: 'Team1',
          data: rankData1,
          backgroundColor: "#7BAFD4",
          borderColor: "#000000",
          borderWidth: "2",
          hoverBackgroundColor: ["#355AB6","#355AB6","#355AB6","#355AB6","#355AB6","355AB6"]
      },{ 
      label: 'Team2',
      data: rankData2,
      backgroundColor: "#BD3D8B",
      borderColor: "#000000",
      borderWidth: "2",
      hoverBackgroundColor: ["#E8CBEA","#E8CBEA","#E8CBEA","#E8CBEA","#E8CBEA","E8CBEA"]

      }]
    }
  })
}

// var ctx = document.getElementById("myChart").getContext('2d');
//   var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: ["OE", "DE", "Tempo", "Size", "Exp"],
//       datasets: [{
//           label: 'Team1',
//           data: [12, 19, 3, 17, 28],
//           backgroundColor: "rgba(153,255,51,1)"
//       }, {
//           label: 'Team2',
//           data: [30, 29, 5, 5, 20],
//           backgroundColor: "rgba(255,153,0,1)"
//       }]
//   }
// });


// function init() {
//   // Grab a reference to the dropdown select element
//   var selector = d3.select("#selDataset");

//   // Use the list of sample names to populate the select options
//   d3.json("/api/team/year/Duke/2017").then((sampleNames) => {console.log(sampleNames)
//   //   sampleNames.forEach((sample) => {
//   //     selector
//   //       .append("option")
//   //       .text(sample)
//   //       .property("value", sample);
//   //   });

//   //   // Use the first sample from the list to build the initial plots
//   //   const firstSample = sampleNames[0];
//   //   buildCharts(firstSample);
//   //   buildMetadata(firstSample);
//   // });
// });

// function optionChanged(newSample) {
//   // Fetch new data each time a new sample is selected
//   buildCharts(newSample);
//   buildMetadata(newSample);
// }

// // Initialize the dashboard
// init()
// }


// function showBar() {
//   // let selTeam = teamDropdown.value;
//   // let selYear = teamYearDropdown.value;
//   let selTeam = 'North Carolina';
//   let selYear = 2019;
//   d3.json(`/api/barSingle/${selTeam}/${selYear}`).then((data) => getBarData(data));
// }

// showBar();

// function getBarData(data) {
//   let rankData = [];

//   // offensive
//   rankData.push(data[0]['norm_Tempo']);
//   rankData.push(data[0]['norm_OE']);
//   rankData.push(data[0]['norm_DE']);
//   rankData.push(data[0]['norm_Exp']);
//   rankData.push(data[0]['norm_Size']);

//   var ctx = document.getElementById("myChart").getContext('2d');
//   var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: ['Tempo', 'OE', 'DE', 'Exp', 'Size'],
//       datasets: [{
//           label: 'Team1',
//           data: rankData,
//           backgroundColor: "#7BAFD4",
//           borderColor: "#000000",
//           borderWidth: "2",
//           hoverBorderColor: "BD3D8B",
//           hoverBackgroundColor: "EBDF7C"
//       }]
//     }
//   })
// }
