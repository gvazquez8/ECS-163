function ScatterPlot(svg, data) {
    function getKey(country) {
        return country.Country;
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
        .range(["red", "blue", "green"])

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
        .attr("transform", `translate(${0.75*svgWidth},40)`);

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
        .attr("stroke-width", "1px")
        .on("click", (d) => {
            if (selectRegion.includes(d)) {
                selectRegion.splice(selectRegion.indexOf(
                        d),
                    selectRegion.indexOf(d) + 1
                );
            } else {
                selectRegion.push(d);
            }

            svg.selectAll("circle").attr("opacity", (d) => {
                return (selectRegion.includes(d.Region) ||
                        selectRegion.length === 0) ===
                    true ?
                    1 :
                    0.2;
            })

            svg.select(".legend")
                .selectAll("circle")
                .attr("opacity", (d) => {
                    return ((selectRegion.includes(d) === true) ||
                            selectRegion.length === 0) ?
                        1 : 0.2;
                })
        });

    d3.select(".legend").selectAll("text")
        .data(colorDomain)
        .enter()
        .append("text")
        .attr("x", 20)
        .attr("y", (d, i) => { return 19.5 * (i + 2) })
        .html((d) => { return d + "<br>"; })
        .on("click", (d) => {
            if (selectRegion.includes(d)) {
                selectRegion.splice(selectRegion.indexOf(
                        d),
                    selectRegion.indexOf(d) + 1
                );
            } else {
                selectRegion.push(d);
            }

            svg.selectAll("circle").attr("opacity", (d) => {
                return (selectRegion.includes(d.Region) ||
                        selectRegion.length === 0) ===
                    true ?
                    1 :
                    0.2;
            })

            svg.select(".legend")
                .selectAll("circle")
                .attr("opacity", (d) => {
                    return ((selectRegion.includes(d) === true) ||
                            selectRegion.length === 0) ?
                        1 : 0.2;
                })

            updateBarGraph(this.data.filter((d) => {
                return (selectRegion.includes(d.Region) ||
                        selectRegion.length === 0) ===
                    true ?
                    true :
                    false;
            }))
        });

    d3.select(".legend")
        .append("text")
        .attr("x", 20)
        .attr("y", 19.5)
        .style("font-weight", "bold")
        .html("Legend");

    this.draw = function(x_data, y_data) {

        this.data = this.data.filter((d) => {
            return (d[x_data] <= 0 || d[y_data] <= 0) ? false :
                true
        });

        x.domain(d3.extent(this.data, (d) => { return d[x_data] }));
        y.domain(d3.extent(this.data, (d) => { return d[y_data] }));

        xAxisContainer.call(d3.axisBottom(x)
            .ticks(3)
            .tickFormat(d3.format(".0s")));
        yAxisContainer.call(d3.axisLeft(y)
            .ticks(5)
            .tickFormat((d) => { return d + '%'; }));

        xAxisLabel.html(x_data);
        yAxisLabel.html(
            y_data);
        title.html(
            `${x_data} vs. ${y_data} By Region`);

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
                            selectRegion.indexOf(d.Region) +
                            1
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
                        tooltip.style("left", d3.event.pageX +
                            "px");
                        tooltip.style("top", d3.event.pageY +
                            "px");
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

                svg.select(".legend")
                    .selectAll("circle")
                    .attr("opacity", (d) => {
                        return ((selectRegion.includes(d) ===
                                    true) ||
                                selectRegion.length === 0) ?
                            1 : 0.2;
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
            });

        update(dataPoints);
    }

    this.draw("GDP ($ per capita)", "Deathrate");
}