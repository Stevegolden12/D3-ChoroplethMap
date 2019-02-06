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

// Legend
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
    .attr("fill", function (d, i) {
      const arr1 = education.filter((i) => i.fips === d.id);  
      const BOH = arr1[0].bachelorsOrHigher;
      if (BOH < 3) {
        return "white"
      } else if (BOH >= 3 && BOH < 12) {
        return "rgb(229, 245, 224)";
      } else if (BOH >= 12 && BOH < 21) {
        return "rgb(199, 233, 192)";
      } else if (BOH >= 21 && BOH < 30) {
        return "rgb(161, 217, 155)";
      } else if (BOH >= 30 && BOH < 39) {
        return "rgb(116, 196, 118)";
      } else if (BOH >= 39 && BOH < 48) {
        return "rgb(65, 171, 93)";
      } else if (BOH >= 48 && BOH < 57) {
        return "rgb(35, 139, 69)";
      } else if (BOH >= 57 && BOH < 66) {
        return "rgb(0, 109, 44)";
      } else if (BOH >= 66) {
        return "rgb(0, 68, 27)";
      } else {
        return "white";
      }

    })
    .attr("stroke", "white")
    .attr("d", d3.geoPath())
    .append("svg:title")
    .text((d, i) => {
      const arr = education.filter((i) => i.fips === d.id);     
      return arr[0].area_name + ": " + arr[0].state + ", " + arr[0].bachelorsOrHigher + "%"
    })
    .attr("data-fips", (d, i) => {
      if (education[i].fips !== null) {
        return education[i].fips;
      } else {
        return null;
      }
    })
    .attr("data-education", (d, i) => {
      if (education[i].bachelorsOrHigher !== null) {
        return education[i].bachelorsOrHigher;
      } else {
        return null;
      }
    })
  
  
  svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
    .attr("class", "states")
    .attr("d", d3.geoPath());

}