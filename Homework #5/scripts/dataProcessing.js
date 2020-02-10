d3.csv("./data/countries_processed.csv", function(error, countries) {
    //  Column Name: Type
    //  Agriculture: Number
    //  Arable (%): Number
    //  Area (sq. mi.): Number
    //  Birthrate: Number
    //  Climate: Number
    //  Coastline (coast/area ratio): Number
    //  Country: String
    //  Crops (%): Number
    //  Deathrate: Number
    //  GDP ($ per capita): Number
    //  Industry: Number
    //  Infant mortality (per 1000 births): Number
    //  Literacy (%): Number
    //  Net migration: Number
    //  Other (%): Number
    //  Phones (per 1000): Number
    //  Pop. Density (per sq. mi.): Number
    //  Population: Number  ​​
    //  Region: String
    //  Service: Number

    if (error)
        throw error;

    // Format data
    countries.forEach((d) => {
        d.Agriculture = +d.Agriculture;
        d["Arable (%)"] = +d["Arable (%)"];
        d["Area (sq. mi.)"] = +d["Area (sq. mi.)"];
        d.Birthrate = +d.Birthrate;
        d.Climate = +d.Climate;
        d["Coastline (coast/area ratio)"] = +d[
            "Coastline (coast/area ratio)"];
        d["Crops (%)"] = +d["Crops (%)"];
        d.Deathrate = +d.Deathrate;
        d["GDP ($ per capita)"] = +d["GDP ($ per capita)"];
        d.Industry = +d.Industry;
        d["Infant mortality (per 1000 births)"] = +d[
            "Infant mortality (per 1000 births)"];
        d["Literacy (%)"] = +d["Literacy (%)"];
        d["Net migration"] = +d["Net migration"];
        d["Other (%)"] = +d["Other (%)"];
        d["Phones (per 1000)"] = +d["Phones (per 1000)"];
        d["Pop. Density (per sq. mi.)"] = +d[
            "Pop. Density (per sq. mi.)"];
        d.Population = +d.Population;
        d.Service = +d.Service;
    });
    initVisuals(countries);
});