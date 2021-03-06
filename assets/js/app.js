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
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv")
  .then(function(allData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
      allData.forEach(function(data, index){
        console.log(data, index);
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
      });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(allData, d => d.poverty)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(allData, d => d.obesity)])
    .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Obesity Rate (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("Poverty Rate (%)");

    // Step 5: Create Circles
    // ==============================


    var circlesGroup = chartGroup.selectAll("circle")
      .data(allData)
      .enter();

      circlesGroup
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.obesity))
      .attr("r", "15")
      .attr("class", "stateCircle");

      circlesGroup
      .append("text")
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.obesity)+5)
      .text(function(d, i=0){return `${d.abbr}`}) 
      .attr("class", "stateText");

  });