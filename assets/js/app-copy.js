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


// initial y-axis
var chosenYAxis = "obesity";

// function used for updating y-scale var upon click on axis label
function yScale(allData, chosenYAxis) {
  // create scales
  console.log(chosenYAxis);
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(allData, d => d[chosenYAxis]) * 0.8,
      d3.max(allData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);
    //console.log(yLinearScale);
  return yLinearScale;
}

// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  //console.log(yAxis);
  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// Import Data
d3.csv("data.csv")
  .then(function(allData) {

    // Parse Data/Cast as numbers
    // ==============================
      allData.forEach(function(data){
        //console.log(data);
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
      });

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(allData, d => d.poverty)])
    .range([0, width]);

    var yLinearScale = yScale(allData, chosenYAxis);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .classed("yAxis", true)
      .call(leftAxis);

    // Create group for  2 y-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)");

    var obesityLabel = labelsGroup.append("text")  
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("value", "obesity")
      .classed("active", true)
      .text("Obesity Rate (%)");
    
    var smokeLabel = labelsGroup.append("text")  
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("value", "smokes")
      .classed("active", false)
      .text("Smoking Rate (%)");

    // Create x-axis labels
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("Poverty Rate (%)");


     // Create Circles
    // ==============================

    var circlesGroup = chartGroup.selectAll("circle")
      .data(allData)
      .enter();

      circlesGroup
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", "15")
      .attr("class", "stateCircle");

      circlesGroup
      .append("text")
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .text(function(d, i=0){return `${d.abbr}`}) 
      .attr("class", "stateText");

      // y axis labels event listener
    labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
        console.log(value); 
        // replaces chosenYAxis with value
        chosenYAxis = value;
  
        // functions here found above csv import
        // updates Y scale for new data
        yLinearScale = yScale(allData, chosenYAxis);
  
        // updates y axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);
  
        // updates circles with new Y values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
  
  
        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  });
