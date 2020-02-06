// this is where your implementation for your scatter plot should go
function ScatterPlot(svg, data, updateFlowDiagram) {

    function keyFunction(data) {
        return data.id;
    }
    function computeCorrelation(data) {
        var numer = d3.sum(data, (d) => {return d.X*d.Y});
        var denom = d3.sum(data, (d) => {return d.X*d.X}) * d3.sum(data, (d) => {return d.Y*d.Y});

        var correlation = (numer)/(Math.sqrt(denom));

        return correlation;
    }
    function computeRegression(data) {

        var meanX = d3.mean(data, (d) => {return d.X});
        var meanY = d3.mean(data, (d) => {return d.Y});

        var standDivX = d3.deviation(data, (d) => {return d.X});
        var standDivY = d3.deviation(data, (d) => {return d.Y});

        var correlation = computeCorrelation(data);

        var b = correlation * (standDivY/standDivX);
        var a = meanY - (b*meanX);

        var results = []

        data.forEach((d) => {
            results.push({
                "X": d.X,
                "Y": a + b*d.X
            });
        });

        return results;
    }

    var margins = {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30
    };

    this.svg = svg;
    // grab the bounding box of the container
    var boundingBox = svg.node().getBoundingClientRect();

    //  grab the width and height of our containing SVG
    var svgHeight = boundingBox.height;
    var svgWidth = boundingBox.width;

    // this is where your code should go to generate the flow diagram from the random data

    var x = d3.scaleLinear().range([0, svgWidth-margins.right-10]);
    var y = d3.scaleLinear().range([svgHeight-margins.bottom, margins.top]);

    var line = d3.line()
                  .x((d) => {
                    return x(d.X)
                  })
                  .y((d) => {
                    return y(d.Y)
                  });

    var xAxisContainer = svg.append("g")
                            .attr("class", "xAxis")
                            .attr("transform", `translate(${margins.left}, ${svgHeight-margins.top})`);
    var yAxisContainer = svg.append("g")
                            .attr("class", "yAxis")
                            .attr("transform", `translate(${margins.left},0)`);
    var circleContainer = svg.append("g")
                             .attr("class", "points")
                             .attr("transform", `translate(${margins.left},0)`);
    var lineContainer = svg.append("g")
                            .attr("class", "line")
                            .attr("transform", `translate(${margins.left},0)`);

    var lineSVG = lineContainer.append("path")
                                .attr("stroke", "black")
                                .attr("stroke-width", "3")
                                .attr("class", "regressionLine");

    var previousExitSelection = undefined;
    this.draw = function(newData) {
        x.domain(d3.extent(newData, (d) => {return d.v0}))
        y.domain(d3.extent(newData, (d) => {return d.v1}))
        xAxisContainer.transition().call(d3.axisBottom(x));
        yAxisContainer.transition().call(d3.axisLeft(y));


        if (previousExitSelection !== undefined)
            previousExitSelection.remove()

        var selection = circleContainer.selectAll("circle")
                           .data(newData, keyFunction)

        function update(selection, className, color) {

            selection.attr("class", className)
                     .attr("cx", (d) => {return x(d.v0);})
                     .attr("cy", (d) => {return y(d.v1);})
                     .attr("r", 5)
                     .style("fill", color);
        }

        update(selection.enter().append("circle").transition(), "enter", "green");
        update(selection.transition(), "update", "orange");
        previousExitSelection = selection.exit();

        var dataSet = []
        data.forEach(function(d) {
            dataSet.push({
                "X" : d.v0,
                "Y" : d.v1
            });
        });

        dataSet = computeRegression(dataSet);

        lineSVG.datum(dataSet)
                .transition()
                .attr("d", line);
    }

    this.draw(data);


}
