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

  console.log(us)
  console.log(education)

    

  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .attr("class", "county")
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("d", d3.geoPath())
    .append("svg:title")
    .text((d, i) => education[i].area_name + ": " + education[i].state + ", " + education[i].bachelorsOrHigher + "%")
    .attr("data-fips",(d,i)=>education[i].fips)
    .attr("data-education", (d, i) => {
      if (education[i].bachelorsOrHigher !== "") {
        return education[i].bachelorsOrHigher;
      } else {
        return "no data";
      }
    })
  
  svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
    .attr("class", "states")
    .attr("d", d3.geoPath());

}