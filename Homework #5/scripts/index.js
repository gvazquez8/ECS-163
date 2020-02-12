var regionScatterPlot = undefined;
var countryBarGraph = undefined;

function initVisuals(data) {
    regionScatterPlot = new ScatterPlot(d3.select("#scatterPlot"), data);
    countryBarGraph = new BarGraph(d3.select("#barGraph"), data);
}

function updateVisuals(data) {
    // TODO - Update visuals
}