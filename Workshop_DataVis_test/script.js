// script.js

// Gegevens uit de CSV laden en de grafiek maken
d3.csv("data.csv").then(function(data) {
    // Controleer of de data correct is geladen
    if (!data || data.length === 0) {
        console.error("Geen geldige gegevens geladen.");
        return;
    }

    // Log de geladen gegevens in de console om te controleren of de data correct is
    console.log(data);

    // Afmetingen van het diagram
    var width = 800;
    var height = 400;
    var barPadding = 5;

    // Schaal voor de x-as (gebaseerd op de namen van de gebruikers)
    var xScale = d3.scaleBand()
        .domain(data.map(function(d) { return d.Name; }))
        .range([0, width])
        .padding(barPadding);

    // Schaal voor de y-as (gebaseerd op de leeftijd van de gebruikers)
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.Age; })])
        .nice()
        .range([height, 0]);

    // Het diagram selecteren en toevoegen van de staafjes
    var svg = d3.select("#grafiek")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return xScale(d.Name);
        })
        .attr("y", function(d) {
            return yScale(+d.Age);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return height - yScale(+d.Age);
        })
        .attr("fill", "steelblue");

    // Voeg assen toe voor meer context
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    svg.append("g")
        .call(yAxis);

    // Log de schaalwaarden om te controleren of de schaling correct is
    console.log("xScale domain:", xScale.domain());
    console.log("yScale domain:", yScale.domain());


}).catch(function(error) {
    // Vang fouten op tijdens het laden van de data
    console.error("Fout bij het laden van de gegevens:", error);
});
