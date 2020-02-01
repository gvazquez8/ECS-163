// this is where your implementation for your flow diagram should go 
function FlowDiagram(svg, data) {
    this.svg = svg;
    
    // grab the bounding box of the container
    var boundingBox = svg.node().getBoundingClientRect();

    //  grab the width and height of our containing SVG
    var svgHeight = boundingBox.height;
    var svgWidth = boundingBox.width;

    // this is where your code should go to generate the flow diagram from the random data
    svg.append("g")
    	.attr("class", "container enter")
    	.attr("fill", "green")
    	.attr("transform", "translate(" + 0 + ",10)")
    svg.append("g")
    	.attr("class", "container update")
    	.attr("transform", "translate(" + (svgWidth)/3 + ",10)")
    svg.append("g")
    	.attr("class", "container exit")
    	.attr("transform", "translate(" + (2*svgWidth)/3 + ",10)")


    enterd = svg.select(".container.enter")
    	.selectAll("text")
    	.data(data)
    
    enterd.enter()
    	.append("text")
    	.attr("y", (d,i) => {return i * 20;})
    	.html((d) => {return d.name});

    data[0].name = "monkey";
    data.splice(0,5);
    enterd.append("text")
    	.attr("y", (d,i) => {return i * 20;})
    	.html((d) => {console.log(d);
    		return d.name});

    enterd.exit()	
    	.append("text")
    	.attr("y", (d,i) => {console.log(d);
    		return i * 20 + 20;})
    	.html((d) => {return d.name});



}
