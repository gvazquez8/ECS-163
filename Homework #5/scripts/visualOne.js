function VisualOne(svg, data) {
    var margins = {
        top: 50,
        bottom: 50,
        left: 30,
        right: 30
    };
    this.data = data;
    this.svg = svg;
    this.svg.attr("height", 600);
    var boundingBox = this.svg.node().getBoundingClientRect();
    const svgHeight = boundingBox.height;
    const svgWidth = boundingBox.width;

    var x = d3.scaleLinear().range([0, svgWidth - margins.right]);
    var y = d3.scaleLinear().range([svgHeight - margins.bottom, margins.top]);

    var xAxisContainer = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform",
            `translate(${margins.left+30}, ${svgHeight-margins.bottom})`);

    var yAxisContainer = svg.append("g")
        .attr("class", "yAxis")
        .attr("transform",
            `translate(${margins.left+30}, ${0})`);

    var xAxisLabel = svg.append("text")
        .attr("id", "xAxisLabel")
        .attr("transform",
            "translate(" + (svgWidth / 2 + margins.left) + " ," +
            (svgHeight - 18) + ")")
        .style("text-anchor", "middle");

    var yAxisLabel = svg.append("text")
        .attr("id", "yAxisLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -(svgHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold");

    var title = svg.append("text")
        .attr("id", "graphTitle")
        .attr("transform", "translate(" + (svgWidth / 2.5 + 120) + "," + 50 +
            ")")
        .style("text-anchor", "middle")
        .style("font-weight", "bold");

    this.draw = function(x_data, y_data) {
        x.domain(d3.extent(data, (d) => { return d[x_data] }));
        y.domain(d3.extent(data, (d) => { return d[y_data] }));

        xAxisContainer.transition().call(d3.axisBottom(x)
            .tickFormat(d3.format(".2s")));
        yAxisContainer.transition().call(d3.axisLeft(y)
            .tickFormat(d3.format(".2s")));

        xAxisLabel.html(x_data).transition();
        yAxisLabel.html(y_data).transition();
        title.html(`${x_data} vs. ${y_data}`).transition();

    }

    this.draw("Population", "Deathrate");
}