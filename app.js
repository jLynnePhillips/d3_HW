var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("Data/data.csv", function (err, journalData) {
  if (err) throw err;

  // Parse Data/Cast as numbers
  journalData.forEach(function (data) {
    data.belowPoverty = +data.belowPoverty;
    data.dentalVisit = +data.dentalVisit;
    //data.abbr = +data.abbr;
  });

  // Create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(journalData, d => d.belowPoverty)+5])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(journalData, d => d.dentalVisit)+5])
    .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(journalData)
  .enter()
  .append("circle")
  .attr("class","dots")
  .attr("cx", d => xLinearScale(d.belowPoverty))
  .attr("cy", d => yLinearScale(d.dentalVisit))
  .attr("r", "15")
  .attr("fill", "cyan")
  .attr("opacity", ".5")

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("No dental visit within past year (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Below Poverty (%)");
  console.log(circlesGroup);
  
  chartGroup.selectAll("dots")
    .data(journalData)
    .enter()
    .append("text")
    .text(function(d){ return d.abbr;})
    .attr("x",  d => xLinearScale(d.belowPoverty))
    .attr("y", d => yLinearScale(d.dentalVisit))
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "black")
    .attr("text-anchor","middle")
});
