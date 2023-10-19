let Datum = "Start Date";

    (async function () {
        const data = await d3.dsv(";", "Data/dataset.csv");

        const dateFormat = d3.timeParse("%d-%m-%Y");

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };

        const svg = d3.select("#scatterplot")
            .attr("width", width)
            .attr("height", height);

        let xScale;
        let yScale;

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
                .call(d3.axisBottom(xScale));

            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(yScale));

            svg.selectAll("circle")
                .data(data)
                .enter().append("circle")
                .attr("cx", d => xScale(dateFormat(d[Datum])))
                .attr("cy", d => yScale(d["ProjectStatus"]))
                .attr("r", 5)
                .attr("fill", d => {
                    if (d["ProjectStatus"] === "Planned") {
                        return "blue";
                    } else if (d["ProjectStatus"] === "Ongoing") {
                        return "green";
                    } else if (d["ProjectStatus"] === "Completed") {
                        return "red";
                    }
                })
                .on("mouseover", function (event, d) {
                    d3.select("#tooltip")
                        .style("display", "block")
                        .html(`<strong>Project Title:</strong> ${d["Project Title"]}<br><strong>Client:</strong> ${d["Client"]}<br><strong>Category:</strong> ${d["Category"]}<br><strong>Researcher:</strong> ${d["Researcher"]}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 20) + "px");
                })
                .on("mouseout", function () {
                    d3.select("#tooltip").style("display", "none");
                });
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
    })();