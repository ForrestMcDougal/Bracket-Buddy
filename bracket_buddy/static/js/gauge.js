let homeTeam = homeTeamDropdown.value;
let homeYear = homeYearDropdown.value;
let awayTeam = awayTeamDropdown.value;
let awayYear = awayYearDropdown.value;
var gauge = document.getElementById("gauge");
d3.json(`/api/predictions/${homeTeam}/${homeYear}/${awayTeam}/${awayYear}`).then((prediction) => {

  showGauge(prediction)
});



function showGauge(data) {
  var est_win = +data.est_win_pct;
  var color = data.win_bar_color;
  console.log(color)
  new Chart(gauge, {
    type: 'horizontalBar',
    data: {
      labels:["%"],
      datasets:[
      {
        label:"Estimated Win %",
        backgroundColor: color,
        data: [est_win]
      }
    ]
  }
});
  // gaugeChart.update();
}
