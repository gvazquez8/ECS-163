function BarGraph(svg, data) {
    function getKey(data) {
        return data.Country;
    }
    var margins = {
        top: 50,
        bottom: 50,
        left: 30,
        right: 50
    };
    this.svg = svg;
    this.svg.attr("height", 600);
    var boundingBox = this.svg.node().getBoundingClientRect();
    const svgHeight = boundingBox.height;
    const svgWidth = boundingBox.width;
    var colorDomain = []
    data.forEach((d) => {
        if (!colorDomain.includes(d.Region)) {
            colorDomain.push(d.Region);
        }
    });
    var color = d3.scaleOrdinal().domain(colorDomain)
        .range(["red", "blue", "green"]);
    var x = d3.scaleBand()
        .range([0, svgWidth - margins.right - 100])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([svgHeight - margins.bottom, margins.top]);

    var barContainer = svg.append("g")
        .attr("class", "barContainer")
        .attr("transform",
            `translate(${1.8*margins.left}, ${-margins.bottom})`);

    var xAxisLabel = svg.append("text")
        .attr("id", "xAxisLabel")
        .attr("transform",
            "translate(" + (svgWidth / 2) + " ," +
            (svgHeight) + ")")
        .style("text-anchor", "middle")
        .style("font-weight", "bold");

    var yAxisLabel = svg.append("text")
        .attr("id", "yAxisLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", -5)
        .attr("x", -(svgHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold");

    var title = svg.append("text")
        .attr("id", "graphTitle")
        .attr("transform", `translate(${(svgWidth / 2)},30)`)
        .style("text-anchor", "middle")
        .style("font-weight", "bold");


    this.draw = function(y_data, barData) {

        barData = barData.filter((d) => {
            return (d[y_data] <= 0) ? false :
                true
        });

        x.domain(barData.map((d) => { return d.Country }));
        y.domain(d3.extent(barData, (d) => { return d[y_data] }));

        xAxisLabel.html("Countries");
        yAxisLabel.html(y_data);
        title.html(`${y_data} per Country`);
        svg.append("g")
            .attr("transform",
                `translate(${1.8*margins.left},${svgHeight-1*margins.bottom})`
            )
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 8)
            .attr("dy", "0.35em")
            .attr("transform", "rotate(45)")
            .style("font-size", "7px")
            .style("text-anchor", "start");


        svg.append("g")
            .attr("transform",
                `translate(${1.8*margins.left}, ${-1})`
            )
            .call(d3.axisLeft(y));

        barContainer.selectAll("rect")
            .data(barData)
            .enter().append("rect")
            .attr("x", function(d) { return x(d.Country); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) {
                return (y(0));
            })
            .attr("height", function(d) {
                return svgHeight - y(0);
            })
            .style("fill", (d) => { return color(d.Region) });

        barContainer.selectAll("rect")
            .data(barData)
            .attr("x", function(d) { return x(d.Country) })
            .attr("y", function(d) {
                return (y(0));
            })
            .attr("height", function(d) {
                return svgHeight - y(0);
            })
            .style("fill", (d) => { return color(d.Region) });

        barContainer.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", function(d) {
                return (y(d[y_data]) + margins.bottom - 10);
            })
            .attr("height", function(d) {
                return svgHeight - y(d[y_data] - 1.5 * margins.bottom);
            })
    }
    this.draw("Phones (per 1000)", data);
}