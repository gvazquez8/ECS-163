function ScatterPlot(svg, data) {
    function getKey(data) {
        return data.Country;
    }
    var margins = {
        top: 50,
        bottom: 50,
        left: 30,
        right: 50
    };
    this.data = data;
    this.svg = svg;
    this.svg.attr("height", 600);
    this.selectRegion = [];
    var boundingBox = this.svg.node().getBoundingClientRect();
    const svgHeight = boundingBox.height;
    const svgWidth = boundingBox.width;

    var x = d3.scaleLog(10).range([0, svgWidth - margins.right - 100]);
    var y = d3.scaleLinear().range([svgHeight - margins.bottom, margins.top]);

    var colorDomain = []
    this.data.forEach((d) => {
        if (!colorDomain.includes(d.Region)) {
            colorDomain.push(d.Region);
        }
    })

    var color = d3.scaleOrdinal().domain(colorDomain)
        .range(["red", "blue", "orange", "green", "Chocolate", "purple",
            "black", "brown", "Chartreuse", "Crimson", "Aqua"
        ])

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
        .attr("transform", `translate(${(svgWidth / 2)},30)`)
        .style("text-anchor", "middle")
        .style("font-weight", "bold");

    var circleContainer = svg.append("g")
        .attr("class", "points")
        .attr("transform", `translate(${margins.left},0)`);


    var legend = d3.select("#scatterPlot").append("g")
        .attr("class", "legend")
        .attr("transform", `translate(725,0)`);

    d3.select(".legend")
        .selectAll("mydots")
        .data(colorDomain)
        .enter()
        .append("circle")
        .attr("cx", 10)
        .attr("cy", (d, i) => { return 19 * (i + 2) })
        .attr("r", 5)
        .style("fill", (d) => { return color(d) })
        .attr("stroke", "black")
        .attr("stroke-width", "1px");

    d3.select(".legend").selectAll("text")
        .data(colorDomain)
        .enter()
        .append("text")
        .attr("x", 20)
        .attr("y", (d, i) => { return 19.5 * (i + 2) })
        .html((d) => { return d + "<br>"; });

    d3.select(".legend")
        .append("text")
        .attr("x", 20)
        .attr("y", 19.5)
        .style("font-weight", "bold")
        .html("Legend");

    this.draw = function(x_data, y_data) {
        x.domain(d3.extent(data, (d) => {
            if (d[x_data] <= 0)
                d[x_data] = 1;
            return d[x_data]
        }));
        y.domain(d3.extent(data, (d) => {
            if (d[y_data] <= 0)
                d[y_data] = 1;
            return d[y_data]
        }));

        xAxisContainer.transition().call(d3.axisBottom(x)
            .ticks(4)
            .tickFormat(d3.format(".2s")));
        yAxisContainer.transition().call(d3.axisLeft(y)
            .ticks(5)
            .tickFormat(d3.format(".2s")));

        xAxisLabel.html(x_data).transition();
        yAxisLabel.html(y_data).transition();
        title.html(`World ${x_data} vs. ${y_data}`).transition();


        var dataPoints = circleContainer.selectAll("circle")
            .data(this.data, getKey);

        dataPoints.exit().remove();

        function update(selection) {
            selection
                .attr("cx", (d) => {
                    return x(d[x_data]) + margins.left
                })
                .attr("cy", (d) => { return y(d[y_data]) })
                .attr("r", 5)
                .style("fill", (d) => { return color(d.Region) })
                .on("click", (d) => {
                    if (selectRegion.includes(d.Region)) {
                        selectRegion.splice(selectRegion.indexOf(
                                d.Region),
                            selectRegion.indexOf(d.Region) + 1
                        );
                    } else {
                        selectRegion.push(d.Region);
                    }

                    svg.selectAll("circle").attr("opacity", (d) => {
                        return selectRegion.includes(d.Region) ===
                            true ?
                            1 :
                            0.1;
                    })
                })
                .on("mouseover", (d) => {
                    if (selectRegion.includes(d.Region)) {
                        var tooltip = d3.select("#tooltip");
                        tooltip.style("left", d3.event.pageX + "px");
                        tooltip.style("top", d3.event.pageY + "px");
                        tooltip.style("visibility", "visible");
                        tooltip.style("text-align", "center");
                        tooltip.html(
                            `<b>${d.Country}</b>\n${x_data}: ${d[x_data]}\n${y_data}: ${d[y_data]}`
                        );
                    }
                })
                .on("mouseleave", (d) => {
                    var tooltip = d3.select("#tooltip");
                    tooltip.style("visibility", "hidden");
                });

        }

        dataPoints.enter()
            .append("circle")
            .attr("cx", (d) => {
                return x(d[x_data]) + margins.left
            })
            .attr("cy", (d) => { return y(d[y_data]) })
            .attr("r", 5)
            .style("fill", (d) => { return color(d.Region) })
            .on("click", (d) => {
                if (selectRegion.includes(d.Region)) {
                    selectRegion.splice(selectRegion.indexOf(
                            d.Region),
                        selectRegion.indexOf(d.Region) + 1
                    );
                } else {
                    selectRegion.push(d.Region);
                }

                svg.selectAll("circle").attr("opacity", (d) => {
                    return (selectRegion.includes(d.Region) ||
                            selectRegion.length === 0) ===
                        true ?
                        1 :
                        0.2;
                })
            })
            .on("mouseover", (d) => {
                if (selectRegion.includes(d.Region) || selectRegion
                    .length === 0) {
                    var tooltip = d3.select("#tooltip");
                    tooltip.style("left", d3.event.pageX + "px");
                    tooltip.style("top", d3.event.pageY + "px");
                    tooltip.style("visibility", "visible");
                    tooltip.style("text-align", "center");
                    tooltip.html(
                        `<b>${d.Country}</b>\n${x_data}: ${d[x_data]}\n${y_data}: ${d[y_data]}`
                    );
                }
            })
            .on("mouseleave", (d) => {
                var tooltip = d3.select("#tooltip");
                tooltip.style("visibility", "hidden");
            })

        update(dataPoints);
    }

    this.draw("Population", "GDP ($ per capita)");
}