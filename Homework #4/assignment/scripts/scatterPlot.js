// this is where your implementation for your scatter plot should go
function ScatterPlot(svg, data, updateFlowDiagram) {

    var keyFunction = function(data) {
        return data.id
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

    var xAxisContainer = svg.append("g")
                            .attr("transform", `translate(${margins.left}, ${svgHeight-margins.top})`);

    var yAxisContainer = svg.append("g")
                            .attr("transform", `translate(${margins.left},0)`);

    var circleContainer = svg.append("g")
                             .attr("transform", `translate(${margins.left},${0})`);

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

}

    this.draw(data);


}
