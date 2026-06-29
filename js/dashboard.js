// =====================================
// Citizen Analytics Dashboard
// dashboard.js
// =====================================

// Replace with your Analytics API URL
const API_URL =
"https://4k1wyl7nfg.execute-api.ap-south-1.amazonaws.com/prod/analytics";

let categoryChart;
let stateChart;
let trendChart;

// =======================================
// Load Dashboard
// =======================================

window.onload = () => {

    loadDashboard();

}

// Refresh Button

document.getElementById("refreshBtn").addEventListener("click", () => {

    loadDashboard();

});

// Auto Refresh Every 30 Seconds

setInterval(loadDashboard,30000);


// =======================================
// Main Function
// =======================================

async function loadDashboard(){

    document.getElementById("loading").style.display="block";

    try{

        const response=await fetch(API_URL);

        const data=await response.json();

        console.log(data);

        updateCards(data);

        updateSummary(data);

        createCategoryChart(data.categories);

        createStateChart(data.states);

        createTrendChart(data.dailyTrend);

    }

    catch(error){

        console.error(error);

        alert("Unable to load analytics.");

    }

    finally{

        document.getElementById("loading").style.display="none";

    }

}


// =======================================
// Update KPI Cards
// =======================================

function updateCards(data){

    document.getElementById("totalSearches").innerText=data.totalSearches;

    document.getElementById("todaySearches").innerText=data.totalSearches;

    document.getElementById("topCategory").innerText=getHighest(data.categories);

    document.getElementById("topState").innerText=getHighest(data.states);

}


// =======================================
// Summary Table
// =======================================

function updateSummary(data){

    const tbody=document.getElementById("summaryTable");

    tbody.innerHTML=`

<tr>
<td>Total Searches</td>
<td>${data.totalSearches}</td>
</tr>

<tr>
<td>Most Popular Category</td>
<td>${getHighest(data.categories)}</td>
</tr>

<tr>
<td>Most Active State</td>
<td>${getHighest(data.states)}</td>
</tr>

<tr>
<td>Total Categories</td>
<td>${Object.keys(data.categories).length}</td>
</tr>

<tr>
<td>Total States</td>
<td>${Object.keys(data.states).length}</td>
</tr>

`;

}


// =======================================
// Highest Value
// =======================================

function getHighest(object){

    let max=0;

    let key="-";

    for(let item in object){

        if(object[item]>max){

            max=object[item];

            key=item;

        }

    }

    return key;

}


// =======================================
// Category Pie Chart
// =======================================

function createCategoryChart(categories){

    const labels=Object.keys(categories);

    const values=Object.values(categories);

    if(categoryChart){

        categoryChart.destroy();

    }

    categoryChart=new Chart(

        document.getElementById("categoryChart"),

        {

            type:"pie",

            data:{

                labels:labels,

                datasets:[{

                    data:values,

                    backgroundColor:[

                        "#38bdf8",
                        "#6366f1",
                        "#f59e0b",
                        "#22c55e",
                        "#ef4444",
                        "#14b8a6",
                        "#8b5cf6",
                        "#ec4899"

                    ]

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"bottom"

                    }

                }

            }

        }

    );

}


// =======================================
// State Bar Chart
// =======================================

function createStateChart(states){

    const labels=Object.keys(states);

    const values=Object.values(states);

    if(stateChart){

        stateChart.destroy();

    }

    stateChart=new Chart(

        document.getElementById("stateChart"),

        {

            type:"bar",

            data:{

                labels:labels,

                datasets:[{

                    label:"Searches",

                    data:values,

                    backgroundColor:"#0ea5e9"

                }]

            },

            options:{

                responsive:true,

                scales:{

                    y:{

                        beginAtZero:true

                    }

                }

            }

        }

    );

}



// =======================================
// Daily Trend
// =======================================

function createTrendChart(dailyTrend){

    const labels=Object.keys(dailyTrend);

    const values=Object.values(dailyTrend);

    if(trendChart){

        trendChart.destroy();

    }

    trendChart=new Chart(

        document.getElementById("trendChart"),

        {

            type:"line",

            data:{

                labels:labels,

                datasets:[{

                    label:"Daily Searches",

                    data:values,

                    borderColor:"#38bdf8",

                    backgroundColor:"rgba(56,189,248,.2)",

                    tension:0.4,

                    fill:true

                }]

            },

            options:{

                responsive:true,

                scales:{

                    y:{

                        beginAtZero:true

                    }

                }

            }

        }

    );

}


// =======================================
// AI Prediction Placeholder
// =======================================

document.getElementById("predictionText").innerHTML=`

<b>Insights</b><br><br>

• Most searched category is displayed above.<br><br>

• Dashboard refreshes automatically every 30 seconds.<br><br>

• Future versions will use Amazon Bedrock to predict scheme demand and provide AI-powered insights.

`;