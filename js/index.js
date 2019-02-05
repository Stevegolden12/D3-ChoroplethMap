/*
Promise.all([
  fetch('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json').then(value => value.json()),
  fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json").then(value => value.json())
  ])
  .then((value) => {
    //json response
    console.log(value)
    })
      .catch((err) => {
        console.log(err);
      });
      */

//Width and Height
const width = 1000
const height = 550

const projection = d3.geoAlbers()
  .scale(1000)
  .translate([width / 2, height / 2])

const path = d3.geoPath()
  .projection(projection);

const svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// Queue up datasets using d3 Queue
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json") //Load State and education information
  .defer(d3.json, "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json") //LOad US Counties
  .await(ready);

// Ready Function, runs when data is loaded
function ready(error, education, counties) {
  if (error) throw error;

  console.log(counties);
  /*
  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features) // Bind TopoJSON data elements
    .enter().append("path")
    .attr("d", path)
    .style("fill", "white")
    .style("stroke", "black");
    */
}