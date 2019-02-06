const width = 960;
const height = 600;

var svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

//Legend scale
const x = d3.scaleLinear()
  .domain([2.6, 75.1])
  .rangeRound([600, 860]);
//Color scale
const color = d3.scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeGreens[9]);

const g = svg.append("g")
  .attr("class", "key")
  .attr("id", "legend")
  .attr("transform", "translate(0,40)");

g.selectAll("rect")
  .data(color.range().map(function (d) {
    d = color.invertExtent(d);
    if (d[0] == null) d[0] = x.domain()[0];
    if (d[1] == null) d[1] = x.domain()[1];
    return d;
  }))
  .enter().append("rect")
  .attr("height", 8)
  .attr("x", function (d) { return x(d[0]); })
  .attr("width", function (d) { return x(d[1]) - x(d[0]); })
  .attr("fill", function (d) { return color(d[0]); });

g.append("text")
  .attr("class", "caption")
  .attr("x", x.range()[0])
  .attr("y", -6)
  .attr("fill", "#000")
  .attr("text-anchor", "start")
  .attr("font-weight", "bold")

g.call(d3.axisBottom(x)
  .tickSize(13)
  .tickFormat(function (x) { return Math.round(x) + '%' })
  .tickValues(color.domain()))
  .select(".domain")
  .remove();

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