console.log("Hello");

Chart.defaults.global.elements.line.fill = false;

d3.json("/api/team/Duke").then(data => {
    var years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];

    var adjEM = "AdjEM"
    var field0= data.map((d) => d[adjEM]);

    var adjOE = "AdjOE";
    var field1 = data.map((d) => d[adjOE]);

    var adjDE = "AdjDE";
    var field2 = data.map((d) => d[adjDE]);

    var height = "Size"
    var field3 = data.map((d) => d[height]);

    var experience = "Exp";
    var field4 = data.map((d) => d[experience]);

    var tempo = "AdjTempo";
    var field5= data.map((d)=> d[tempo]);

    var eFGo = "eFG_Pct_O";
    var field6 = data.map((d)=> d[eFGo]);

    var eFGd = "eFG_Pct_D";
    var field7 = data.map((d)=> d[eFGd]);


        new Chart(document.getElementById("scatter"), {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Offensive Efficiency',
                data: field1
            },
                {label: 'Defensive Efficiency',
                data: field2
            },
                {label: "Adjusted Scoring Margin",
                data: field0
            },
                {label: "Average Height",
                data: field3
            },
                {label: "Team Experience",
                data: field4
            },
                {label: "tempo",
                data: field5
            },
                {label: "Effective FG% Offense",
                data: field6
            },
                {label: "Effective FG% Defense",
                data: field7
            },
            ]
    
            }
        },
        );
        }
    

);