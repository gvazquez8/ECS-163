// this is where your implementation for your flow diagram should go
function FlowDiagram(svg, data) {
    this.svg = svg;
    this.enter_y = 0;
    this.update_y = 0;
    this.exit_y = 0;
    // grab the bounding box of the container
    var boundingBox = svg.node().getBoundingClientRect();

    // grab the width and height of our containing SVG
    var svgHeight = boundingBox.height;
    var svgWidth = boundingBox.width;

    function keyFunction(d) {
        return d.id;
    }

    // this is where your code should go to generate the flow diagram from the random data
    selection = svg.selectAll("text")
    	.data(data, keyFunction);


    // Enter NEW data
    selection.enter()
    	.append("text")
        .attr("fill", "green")
        .attr("x", 0)
    	.attr("y", () => {this.enter_y += 20; return this.enter_y;})
    	.html((d) => {return d.name});

    // //Update Data
    selection.append("text")
        .attr("fill", "orange")
        .attr("x", svgWidth/3)
        .attr("y", () => {this.update_y += 20; return this.update_y;})
        .html((d) => {return d.name});

    // //Remove unneeded data
    selection.exit()
        .append("text")
        .attr("fill", "red")
        .attr("x", 2*svgWidth/3)
        .attr("y", () => {this.exit_y += 20; return this.exit_y;})
        .html((d) => {return d.name});


    this.draw = function(newData) {
        var selection = this.svg.selectAll("text")
                            .data(newData);
        selection.transition()
                .attr("fill", "orange")
                .attr("x", svgWidth/3)
                .attr("y", () => {
                    this.enter_y -= 20;
                    this.update_y += 20;
                    return this.update_y;});

        var entering = selection.enter()
                                .append("text")
                                .attr("fill", "green")
                                .attr("x", 0)
                                .attr("y", () => {this.enter_y += 20; return this.enter_y;})
                                .html((d) => {return d.name});


        selection.exit()
                .attr("fill", "red")
                .attr("x", 2*svgWidth/3)
                .attr("y", () => {
                    this.exit_y += 20;
                    return this.exit_y;
                })
                .html((d) => {return d.name});
    }
}
