var regionScatterPlot = undefined;
var countryBarGraph = undefined;
var selectRegion = [];

function initVisuals(data) {
    regionScatterPlot = new ScatterPlot(d3.select("#scatterPlot"), data);
    countryBarGraph = new BarGraph(d3.select("#barGraph"), data);
}