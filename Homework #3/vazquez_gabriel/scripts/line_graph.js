// set the dimensions and margins of the graph
var margin = {
    top: 0,
    right: 20,
    bottom: 10,
    left: 20
  },
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var csv_data;
// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
  .x(function(d) {
    return x(d[0]);
  })
  .y(function(d) {
    return y(d[1]);
  });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin

var svg = d3.select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);


// Get the data
d3.csv("./data/2010-2017_review.csv", function(error, data) {
  if (error) throw error;
  // format the data
  csv_data = data;
  var line_data = []
  data.forEach(function(d) {
    d.year = parseTime(d.years);
    d.Chinatown = +d.Chinatown;
    line_data.push([d.years, d.Chinatown])
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) {
    return d.years;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.Chinatown;
  })]).nice();
  // Add the valueline path.
  svg.append("path")
    .data([line_data])
    .attr("class", "line2")
    .attr("d", valueline)
    .attr("transform", "translate(52" + ", 70" + ")")

  svg.selectAll("dot")
    .data(csv_data)
    .enter().append("circle")
    .attr("class", "dataPoint")
    .attr("r", 5)
    .attr("cx", (d) => {return x(d.years)})
    .attr("cy", (d) => {return y(d.Chinatown)})
    .attr("transform", "translate(52,70)")
    .style("opacity", "0")
    .on("mouseover", (d,i,n) => {
      d3.select(n[i]).style("opacity", "1");
      var dataText = d3.selectAll(".dataText").nodes()[i];
      d3.select(dataText).style("opacity", "1");
    })
    .on("mouseleave", (d,i,n) => {
      d3.select(n[i]).style("opacity", "0");
      var dataText = d3.selectAll(".dataText").nodes()[i];
      d3.select(dataText).style("opacity", "0");
    });

  svg.selectAll("dot")
    .data(csv_data)
    .enter().append("text")
    .attr("class", "dataText")
    .attr("x", (d) => {return x(d.years)})
    .attr("y", (d) => {return y(d.Chinatown)})
    .attr("transform", "translate(57,60)")
    .style("opacity", "0")  
    .html((d) => {return d.Chinatown});


  // Add the X Axis
  var marginB = 460;

  svg.append("g")
    .attr("transform", "translate(50," + marginB + ")")
    .call(d3.axisBottom(x)
      .tickFormat(d3.format(".4r")));

  // Add the Y Axis
  svg.append("g")
    .attr('class', 'y axis')
    .attr("transform", "translate(50" + ", 70" + ")")
    .call(d3.axisLeft(y)
      .ticks(5));

  svg.append("text")
    .attr("class", "axisLabel")
    .attr("transform",
      "translate(" + (width / 2.5 + 120) + " ," +
      (height + 110) + ")")
    .style("text-anchor", "middle")
    .text("Years");


  svg.append("text")
    .attr("class", "axisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", -70 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Number of Reviews");

  svg.append("text")
    .attr("class", "graphTitle")
    .attr("transform", "translate(" + (width / 2.5 + 120) + "," + 50
      + ")")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Chinatown");
});


function updateGraph(district) {
  // format the data

  var line_data = [];
  csv_data.forEach(function(d) {
    d.year = parseTime(d.years);
    d[district] = +d[district];

    line_data.push([d.years, d[district]]);
  });
  // Scale the range of the data
  x.domain(d3.extent(csv_data, function(d) {
    return d.years;
  }));
  y.domain([0, d3.max(csv_data, function(d) {
    return d[district];
  })]).nice();

  // Add the valueline path.
  svg.select(".line2")
    .data([line_data])
    .attr("d", valueline)
    .attr("transform", "translate(52" + ", 70" + ")");

  // Add the Y Axis
  svg.select(".y.axis")
    .attr("transform", "translate(50" + ", 70" + ")")
    .call(d3.axisLeft(y)
      .ticks(5));

  svg.selectAll(".dataPoint")
    .attr("cx", (d) => {return x(d.years)})
    .attr("cy", (d) => {return y(d[district])});

  svg.selectAll(".dataText")
    .attr("x", (d) => {return x(d.years)})
    .attr("y", (d) => {return y(d[district])})
    .html((d) => {return d[district]});

  svg.select(".graphTitle")
    .text(district.replace(/_/g, " "));
}