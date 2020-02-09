// TODO create functions to provide relevant data to our vis
d3.csv("./data/countries_processed.csv", function(error, countries) {
    //
    //	Column Name: Type
    //		Agriculture: Number
    //		Arable (%): Number
    //		Area (sq. mi.): Number
    //		Birthrate: Number
    //		Climate: Number
    //		Coastline (coast/area ratio): Number
    //		Country: String
    //		Crops (%): Number
    //		Deathrate: Number
    //		GDP ($ per capita): Number
    //		Industry: Number
    //		Infant mortality (per 1000 births): Number
    //		Literacy (%): Number
    //		Net migration: Number
    //		Other (%): Number
    //		Phones (per 1000): Number
    //		Pop. Density (per sq. mi.): Number
    //		Population: Number	​​
    //		Region: String
    //		Service: Number

    if (error)
        throw error

    countries.forEach((data) => {
        console.log(data);
    });
});