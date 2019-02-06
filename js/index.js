const width = 960;
const height = 600;

var svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

// Define the div for the tooltip
var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);


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
    .attr("data-fips", function (d) {
      return d.id
    })
    .attr("data-education", function (d) {
      var result = education.filter(function (obj) {
        return obj.fips == d.id;
      });
      if (result[0]) {
        return result[0].bachelorsOrHigher
      }
      //could not find a matching fips id in the data
      console.log('could find data for: ', d.id);
      return 0
    })
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("d", d3.geoPath())   
  

  svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
    .attr("class", "states")
    .attr("d", d3.geoPath());

}