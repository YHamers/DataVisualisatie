(async function() {
    // Laad het CSV-bestand met D3.js
    const data = await d3.dsv(";", "Data/dataset.csv");

    // Array om de waarden van de kolom "Content.soort" op te slaan
    const contentSoortValues = [];

    // Loop over de data en sla de waarden van de kolom "Content.soort" op
    data.forEach(function(d) {
      contentSoortValues.push(d.Category);
    });

    // Functie om de frequentie van unieke waarden te tellen
    function countUniqueValues(arr) {
      const counts = {};
      arr.forEach(function(value) {
        counts[value] = (counts[value] || 0) + 1;
      });
      return counts;
    }

    const counts = countUniqueValues(contentSoortValues);

    // Converteer de frequentieobjecten naar een array van objecten voor D3.js
    const dataForPieChart = Object.keys(counts).map(function(key) {
      return {
        value: counts[key],
        label: key
      };
    });

    // Creëer een cirkeldiagram met D3.js
    const width = 1000; // Breedte van het diagram
    const height = 400; // Hoogte van het diagram
    const radius = Math.min(width, height) / 2; // Straal van de cirkel

    const svg = d3.select("#chart2")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie()
      .value(function(d) { return d.value; });

    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const arcs = svg.selectAll("arc")
      .data(pie(dataForPieChart))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", function(d, i) { return color(i); });

      arcs
      .on("mouseover", function() {
        d3.select(this).select("path").attr("fill", "gray"); // Kleur feller maken bij hover
      })
      .on("mouseout", function() {
        d3.select(this).select("path").attr("fill", function(d, i) { return color(i); }); // Terug naar normale kleur
      });

    // Voeg legenda toe
    const legend = svg.selectAll(".legend")
      .data(dataForPieChart)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return `translate(0,${i * 30})`;
      });

    legend.append("rect")
      .attr("x", -400)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d, i) { return color(i); });

    legend.append("text")
      .attr("x", -380)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return `${d.label} (${d.value})`; });



      arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", function(d, i) { return color(i); });

    arcs
      .on("mouseover", function() {
        d3.select(this).select("path").attr("fill", "lightgray"); // Kleur wijzigen bij hover
      })
      .on("mouseout", function() {
        d3.select(this).select("path").attr("fill", function(d, i) { return color(i); }); // Terug naar normale kleur
      });
  })();