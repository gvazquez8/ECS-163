	const uniqueScheme = ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59",
	    "#ef6548", "#d7301f"
	]
	var highlighted_district = undefined;
	var legendThresholds = [
	    [1, 25],
	    [25, 50],
	    [50, 100],
	    [100, 200],
	    [200, 300],
	    [300, 700]
	];
	// load data with queue
	var url1 = "./data/neighborhood.geojson";
	var url2 = "./data/listing_count.json";

	var q = d3_queue.queue(1)
	    .defer(d3.json, url1)
	    .defer(d3.json, url2)
	    // .defer(d3.csv, url3)
	    .awaitAll(draw);

	function draw(error, data) {
	    "use strict";
	    // important: First argument it expects is error
	    if (error) throw error;
	    // initialize the Bayview as the default neighborhood
	    var field = "Bayview";

	    var margin = 50,
	        width = 450 - margin,
	        height = 500 - margin;

	    var color = d3.scaleThreshold()
	        .domain([1, 25, 50, 100, 200, 300, 700])
	        .range(uniqueScheme);

	    var legendScale = d3.scaleLinear()
	        .domain([1, 700])
	        .range([margin, 500]);



	    // create a projection properly scaled for SF
	    var projection = d3.geoMercator()
	        .center([-122.433701, 37.767683])
	        .scale(175000)
	        .translate([width / 1.5, height / 1.74]);

	    // create a path to draw the neighborhoods
	    var path = d3.geoPath()
	        .projection(projection);

	    // create and append the   of SF neighborhoods
	    var map = d3.select('#map').selectAll('path')
	        .data(data[0].features)
	        .enter()
	        .append('path')
	        .attr('d', path)
	        .style('stroke', 'black')
	        .style('stroke-width', 1)
	        .on("mouseover", (datum, index, nodes) => {
	            showTooltip(datum, index, nodes);
	        })
	        .on("mousemove", (datum, index, nodes) => {
	            moveTooltip(datum, index, nodes);
	        })
	        .on("mouseleave", (datum, index, nodes) => {
	            hideTooltip(datum, index, nodes);
	        })
	        .on("click", (datum, index, nodes) => {
	            selectDistrict(datum, index, nodes);
	        });
	    map.datum(function(d) {
	        var normalized = d.properties.neighbourhood
	            .replace(/ /g, '_')
	            .replace(/\//g, '_');

	        d.properties.neighbourhood = normalized;
	        d.count = data[1][d.properties.neighbourhood];
	        return d;
	    });

	    var legend = d3.select("#map")
	        .append("g")
	        .attr("class", "legendWrapper")
	        .selectAll("rect")
	        .data(legendThresholds)
	        .enter()
	        .append("rect")
	        .attr("x", (datum) => {
	            return margin + legendScale(datum[0]);
	        })
	        .attr("y", height + 150)
	        .attr("height", 8)
	        .attr("width", (datum) => {
	            return legendScale(datum[1] - datum[0]) - margin;
	        })
	        .attr("fill", (datum, index) => {
	            return color(datum[0]);
	        });

	    var ticks = d3.select("#map")
	        .append("g")
	        .attr("transform", "translate(" + margin + "," + (height + 150) + ")")
	        .call(d3.axisBottom(legendScale).tickValues([1, 25, 50, 100, 200, 300,
	            700
	        ]).tickSize(10));

	    d3.select(".domain")
	        .style("stroke-width", "0px");

	    d3.select("#map")
	        .append("text")
	        .attr("transform", "translate(" + (margin + 50) + "," + (height + 145) +
	            ")")
	        .style("font-size", "10px")
	        .style("font-weight", "bold")
	        .text("Number of Airbnb listings");
	    // // normalize neighborhood names
	    // // add the neighborhood name as its class
	    map
	        .attr('class', function(d) {
	            return d.properties.neighbourhood;
	        })
	        .attr("fill", function(d) {
	            return color(d.count);
	        })
	        .attr("transform", "translate(60" + ", 50" + ")")
	}


	function showTooltip(datum, index, nodes) {
	    // Initialize tooltip when user mouses over district on map

	    var tooltip = d3.select("#mapTooltip");
	    tooltip.style("left", d3.event.pageX + "px");
	    tooltip.style("top", d3.event.pageY + "px");
	    tooltip.style("visibility", "visible");
	    tooltip.style("text-align", "center");
	    tooltip.html("<b>" + datum.properties.neighbourhood.replace(/_/g, " ") +
	        "</b>\n" + "Number of listings:\n" + datum.count + "</span>");
	}

	function moveTooltip(datum, index, nodes) {
	    // Move tooltip as mouse moves while over district
	    var tooltip = d3.select("#mapTooltip");
	    tooltip.style("left", (d3.event.pageX) + "px");
	    tooltip.style("top", (d3.event.pageY) + "px");
	}

	function hideTooltip(datum, index, nodes) {
	    var tooltip = d3.select("#mapTooltip");
	    tooltip.style("visibility", "hidden");
	}

	function selectDistrict(datum, index, nodes) {
	    if (nodes[index] === highlighted_district) {
	        d3.select("#map").selectAll("path").style("opacity", 1);
	        highlighted_district = undefined;
	    } else {
	        d3.select("#map").selectAll("path").style("opacity", 0.2);
	        d3.select(nodes[index]).style("opacity", 1);
	        highlighted_district = nodes[index];
	        updateGraph(highlighted_district.className.baseVal);
	    }
	}