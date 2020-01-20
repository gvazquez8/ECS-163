// Set the dimensions of the canvas / graph

var margin = {top: 10, right: 20, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 470 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleLog(10).range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var r = d3.scaleLinear().range([4, 10]);




// define the line
// var valueline = d3.line()
//     .x(function(d) { return x(d.date); })
//     .y(function(d) { return y(d.close); });

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".center").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.tsv("./data/gapminderDataFiveYear.tsv", function(error, data) {
    if (error) throw error;

    data = data.filter((d) => {
        return d.year === '1952' || d.year === '2007';
    });

    // format the data (i.e., process it such that strings are converted to their appropriate types)
    data.forEach(function(d) {
        // d.date = parseTime(d.date);
        // d.close = +d.close;
        d.year = Number(d.year);
        d.pop = Number(d.pop);
        d.lifeExp = Number(d.lifeExp);
        d.gdpPercap = Number(d.gdpPercap);
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.gdpPercap; }));
    y.domain(d3.extent(data, function(d) { return d.lifeExp; }));
    r.domain(d3.extent(data, function(d) { return d.pop; }))


    // Add the valueline path.
    // svg.append("path")
    //     .data([data])
    //     .attr("class", "line")
    //     .attr("d", valueline);


    // Add the scatterplot
    svg.selectAll("dot")
        .data(data.filter((d) => {
            return d.year === 1952;
        }))
        .enter().append("circle")
        .style("fill", d3.schemeCategory10[0])
        .attr("r", function(d) { return r(d.pop); })
        .attr("cx", function(d) { return x(d.gdpPercap); })
        .attr("cy", function(d) { return y(d.lifeExp); });

    svg.selectAll("dot")
        .data(data.filter((d) => {
            return d.year === 2007;
        }))
        .enter().append("circle")
        .style("fill", d3.schemeCategory10[1])
        .attr("r", function(d) { return r(d.pop); })
        .attr("cx", function(d) { return x(d.gdpPercap); })
        .attr("cy", function(d) { return y(d.lifeExp); });

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(11, ".0s"));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Set the Axis Labels
    svg.append("text")
        .attr("transform", "translate(" + (width/2) + "," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("GDP per Capita")

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Life Expectancy")

    // Set Graph Title
    svg.append("text")
        .attr("transform", "translate(" + ((width/2)-125) + ",0)")
        .attr("dy", "1em")
        .style("font", "16px")
        .style("font-weight", "bold")
        .style("text-decoration", "underline")
        .text("GDP vs Life Expectancy (1952, 2007)")

    // Set Legend
    svg.append("rect")
        .attr("x", width -40)
        .attr("y", margin.top + 20)
        .attr("width", "20")
        .attr("height", "20")
        .style("fill", d3.schemeCategory10[0])
    svg.append("text")
        .attr("transform", "translate(" + (width-15)+ "," + (margin.top+35) + ")")
        .style("font-size", "11px")
        .text("1952")

    svg.append("rect")
        .attr("x", width - 40)
        .attr("y", margin.top + 42)
        .attr("width", "20")
        .attr("height", "20")
        .style("fill", d3.schemeCategory10[1])
    svg.append("text")
        .attr("transform", "translate(" + (width-15)+ "," + (margin.top + 57) + ")")
        .style("font-size", "11px")
        .text("2007")


});
