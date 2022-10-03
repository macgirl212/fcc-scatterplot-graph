const width = 650
const height = 600
const legendCirSize = 20
const colorRange = ["rgb(163, 11, 55)", "rgb(11, 122, 117)"]
const keys = ["Doped", "Did not dope"]

const margin = 50

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then((data) => {
    const timeParse = d3.timeParse('%M:%S')
    const timeFormat = d3.timeFormat('%M:%S')
    data.forEach(d => {d.Time = timeParse(d.Time)})

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(colorRange)

    const fillDot = (d) => {
        if (d.Doping === '') {
            return colorRange[1]
        } else {
            return colorRange[0]
        }
    }

    const yScale = d3.scaleLinear()
        .domain([d3.max(data, d => d.Time), d3.min(data, d => d.Time)])
        .range([height, 0]);

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
        .range([0, width])

    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)
    const xAxis = d3.axisBottom(xScale).tickFormat(d => d)

    const svg = d3.select("svg")
        .style("height", height + margin + margin)
        .style("width", width + margin + margin)
        .style("background", "rgb(174, 197, 235)")
        .style("z-index", "-1")
        .append("g")
            .attr("transform", `translate(${margin}, ${margin})`)

    const tooltip = d3.select("tooltip")
        .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0)
            .style("background-color", "rgb(155, 188, 243)")
            .style("border-radius", "5px")
            .style("border-color", "white")
            .style("border-style", "solid")
            .style("border-width", "1px")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("padding", "5px")

    const mouseover = function(event, d) {
        const [x, y] = d3.pointer(event)
        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9)

        tooltip.html(d.Name +
            ': ' +
            d.Nationality +
            '<br/>' +
            'Year: ' +
            d.Year +
            ', Time: ' +
            timeFormat(d.Time) +
            (d.Doping ? '<br/><br/>' + d.Doping : ''))
            .attr("data-year", d.Year)
            .style("left", x + 420 + "px")
            .style("top", y + 100 + "px");
    }

    const mouseout = function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", 0)
    }

    svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", "dot")
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => d.Time)
            .attr("r", 5)
            .attr("cx", d => xScale(d.Year))
            .attr("cy", d => yScale(d.Time))
            .style("fill", d => fillDot(d))
            .style("stroke", "rgb(255, 255, 255)")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)

    svg.append("g")
        .attr("id", "y-axis")
        .call(yAxis)

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("id", "x-axis")
        .call(xAxis)

    svg.selectAll("#legend")
        .data(keys)
        .enter()
        .append("circle")
            .attr("id", "legend")
            .style("fill", d => color(d))
            .attr("width", legendCirSize)
            .attr("height", legendCirSize)
            .attr("r", 7)
            .attr("cx", 500)
            .attr("cy", (d, i) => 100 + i * legendCirSize)

    svg.selectAll("labels")
        .data(keys)
        .enter()
        .append("text")
            .attr("x", 510)
            .attr("y", (d, i) => 100 + i * legendCirSize)
            .style("fill", d => color(d))
            .text(d => d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
})