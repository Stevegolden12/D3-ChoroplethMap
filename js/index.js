const width = 960;
const height = 600;

var svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

// Queue up datasets using d3 Queue
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json") //LOad US Counties
  .defer(d3.json, "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json") //Load State and education information
  .await(ready);

// Ready Function, runs when data is loaded
function ready(error, us, education) {
  if (error) throw error;


  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .attr("class", "county")
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("d", d3.geoPath())   
  

  svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
    .attr("class", "states")
    .attr("d", d3.geoPath());

}