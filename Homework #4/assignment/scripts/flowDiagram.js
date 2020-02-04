// this is where your implementation for your flow diagram should go
function FlowDiagram(svg, data) {
    this.svg = svg;
    // grab the bounding box of the container
    var boundingBox = svg.node().getBoundingClientRect();

    // grab the width and height of our containing SVG
    var svgHeight = boundingBox.height;
    var svgWidth = boundingBox.width;
    var textDistance = 15;

    function keyFunction(data) {
        return data.id;
    }


    // this is where your code should go to generate the flow diagram from the random data
    var previousExitSelection = undefined;
    this.draw = function(newData) {
    	this.enter_y = 0;
    	this.update_y = 0;
    	this.exit_y = 0;

        // Remove Previous Exiting Data
    	if (previousExitSelection !== undefined)
    		previousExitSelection.remove();

        var selection = this.svg.selectAll("text")
                            .data(newData, keyFunction);
    	// Add New Data
        selection.enter()
                 .append("text")
                 .attr("class", "enter")
                 .attr("fill", "green")
                 .attr("x", 0)
                 .attr("y", () => {return (++this.enter_y) * textDistance;})
                 .html((d) => {return d.name})
                 .transition();

        // Transition Data from Enter -> Update
        selection.transition()
                .attr("fill", "orange")
                .attr("class", "update")
                .attr("x", svgWidth/3)
                .attr("y", () => {return (++this.update_y)*textDistance;});

        // Transition Data from Enter/Update -> Exit
        selection.exit().transition()
                .attr("fill", "red")
                .attr("class", "exit")
                .attr("x", 2*svgWidth/3)
                .attr("y", () => {return (++this.exit_y)*textDistance;});

        previousExitSelection = selection.exit();
    }

    this.draw(data)
}
