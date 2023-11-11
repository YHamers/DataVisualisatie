let Datum = "Start Date";

    (async function () {
        const data = await d3.dsv(";", "Data/dataset.csv");

        const dateFormat = d3.timeParse("%d-%m-%Y");


        

        const width = 1000;
        const height = 500;
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };

        const svg = d3.select("#scatterplot")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", "rgb(65, 65, 65)");

        let xScale;
        let yScale;

        const colorScale = d3.scaleOrdinal()
            .domain(["Research", "Development", "Education"])
            .range(["blue", "orange", "green"]);

        function createChart() {
            xScale = d3.scaleTime()
                .domain([
                    d3.min(data, d => dateFormat(d[Datum])),
                    d3.max(data, d => dateFormat(d[Datum]))
                ])
                .range([margin.left, width - margin.right]);

            yScale = d3.scalePoint()
                .domain(["Planned", "Ongoing", "Completed"])
                .range([margin.top, height - margin.bottom])
                .padding(0.5);

            

            

            svg.selectAll("*").remove();

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0, ${height - margin.bottom})`)
                .call(d3.axisBottom(xScale))
                .style("fill", "white");

            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${margin.left}, 0)`)
                .style("fill", "white")
                .call(d3.axisLeft(yScale));

            svg.select(".y-axis")
                .selectAll("text")
                .style("text-anchor", "end") 
                .attr("dx", "2em") 
                .attr("dy", "-10px") 
                .attr("transform", "rotate(-450)");

            svg.selectAll(".x-axis text") 
                .style("fill", "white") 
                .style("font-size", "14px");

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", margin.top - 5)
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", "16px")
                .text("Scatterplot projectstatus " + (Datum === "Start Date" ? "Start" : "Eind") + " datum");
        

            svg.append("g")
                .attr("class", "grid-lines")
                .selectAll("line.y-line")
                .data(yScale.domain())
                .enter().append("line")
                .attr("class", "y-line")
                .attr("x1", margin.left)
                .attr("x2", width - margin.right)
                .attr("y1", d => yScale(d) + yScale.bandwidth() / 2)
                .attr("y2", d => yScale(d) + yScale.bandwidth() / 2)
                .style("stroke", "rgba(255, 255, 255, 0.3)")
                .style("stroke-dasharray", "2");

            svg.append("g")
                .attr("class", "grid-lines")
                .selectAll("line.x-line")
                .data(xScale.ticks())
                .enter().append("line")
                .attr("class", "x-line")
                .attr("x1", d => xScale(d))
                .attr("x2", d => xScale(d))
                .attr("y1", margin.top)
                .attr("y2", height - margin.bottom)
                .style("stroke", "rgba(255, 255, 255, 0.3)")
                .style("stroke-dasharray", "2");


            

            svg.selectAll("text") // Tekstkleur wit maken
                .style("fill", "white");

            

            svg.selectAll("circle")
                .data(data)
                .enter().append("circle")
                .attr("cx", d => xScale(dateFormat(d[Datum])))
                .attr("cy", d => yScale(d["ProjectStatus"]))
                .attr("r", 5)
                .attr("fill", d => colorScale(d["Category"]))
                
                .on("click", function (event, d) {
                    // Redirect to Overview.html with the data for the selected row
                    window.location.href = `View.html?projectTitle=${d["Project Title"]}&client=${d["Client"]}&category=${d["Category"]}&researcher=${d["Researcher"]}`;
                })
                .on("mouseover", function (event, d) {
                    d3.select("#tooltip")
                        .style("display", "block")
                        .html(`<strong>Project Title:</strong> ${d["Project Title"]}<br><strong>Client:</strong> ${d["Client"]}<br><strong>Category:</strong> ${d["Category"]}<br><strong>Researcher:</strong> ${d["Researcher"]}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("color", "white")
                        .style("top", (event.pageY - 20) + "px");
                })
                .on("mouseout", function () {
                    d3.select("#tooltip").style("display", "none");
                });
        }

        const zoom = d3.zoom()
    .scaleExtent([1, 10]) // Pas de schaalgrenzen aan zoals nodig
    .on("zoom", zoomed);

svg.call(zoom);

function zoomed(event) {
    const newXScale = event.transform.rescaleX(xScale);

    svg.select(".x-axis")
        .call(d3.axisBottom(newXScale));

    svg.selectAll("text") // Selecteer alle tekst op de x-as
        .style("fill", "white");

    svg.selectAll("circle")
        .attr("cx", d => newXScale(dateFormat(d[Datum])));
}


    

        createChart();

        d3.select("#button1").on("click", function () {
            Datum = "Start Date";
            createChart();
        });

        d3.select("#button2").on("click", function () {
            Datum = "EndDate";
            createChart();
        });


     
function updateChart(startSliderValue, endSliderValue) {
   
    const startDate = d3.min(data, d => dateFormat(d["Start Date"]));
    const endDate = d3.max(data, d => dateFormat(d["EndDate"]));
    
    const newXDomain = [
        startDate.getTime() + startSliderValue * (endDate.getTime() - startDate.getTime()),
        startDate.getTime() + endSliderValue * (endDate.getTime() - startDate.getTime())
    ];

  
    xScale.domain(newXDomain);

  
    svg.select(".x-axis")
        .call(d3.axisBottom(xScale));

    svg.selectAll(".x-axis text") 
        .style("fill", "white");

    svg.selectAll("circle")
        .attr("cx", d => xScale(dateFormat(d[Datum])));
}


d3.select("#start-date-slider").on("input", function () {
    const startSliderValue = +this.value;
    const endSliderValue = +d3.select("#end-date-slider").node().value;
    updateChart(startSliderValue, endSliderValue);
});

d3.select("#end-date-slider").on("input", function () {
    const startSliderValue = +d3.select("#start-date-slider").node().value;
    const endSliderValue = +this.value;
    updateChart(startSliderValue, endSliderValue);
});



        
    })();