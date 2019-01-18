var width = 1000,
    height = 600,
    margin = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
var US_GEO_DATA_JSON = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
var US_EDUCATION_DATA_JSON = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
var DATA_URLS = [US_GEO_DATA_JSON, US_EDUCATION_DATA_JSON]


var path = d3.geoPath()


document.addEventListener("DOMContentLoaded", function(e) {

    Promise.all(DATA_URLS.map(url => d3.json(url))).then(processData);

    //d3.json(URL).then(processData)
})

function processData(data) {

    var [geo_data, education_data] = data
    var counties = topojson.feature(geo_data, geo_data.objects.counties).features

    drawGraph(counties, education_data)


}

function makeScales(data) {

    var [min, max] = d3.extent(data, function(d) {
        return d.bachelorsOrHigher;
    })
    var xScale = d3.scaleLinear()
        .domain([min, max])
        .rangeRound([600, 840]);
    var colorScale = d3.scaleThreshold().domain(d3.range(min, max, (max - min) / 8)).range(d3.schemeBlues[9])
    var scales = [xScale, colorScale]
    return scales;
}

function drawLegend(scales, canvas) {
    var [xScale, colorScale] = scales

    var g = canvas.append('g')
        .attr("class", "key")
        .attr("id", "legend")
        .attr("transform", "translate(0,40)")
    console.log(colorScale.range())
    g.selectAll("rect")
        .data(colorScale.range().map(function(d) {
            d = colorScale.invertExtent(d)
            if (d[0] == null) d[0] = xScale.domain()[0]
            if (d[1] == null) d[1] = xScale.domain()[1]
            return d
        }))
        .enter()
        .append("rect")
        .attr("height", 8)
        .attr("x", function(d) {
            return xScale(d[0])
        })
        .attr("width", function(d) {
            return xScale(d[1]) - xScale(d[0])
        })
        .attr("fill", function(d) {
            return colorScale(d[0])
        })

    g.call(d3.axisBottom(xScale).tickSize(9).tickFormat(function(x) {
                return Math.round(x) + "%"
            })
            .tickValues(colorScale.domain())

        ).select(".domain")
        .remove();
}

function drawGraph(geoData, education_data) {
    var canvas = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    var scales = makeScales(education_data)
    var [xScale, colorScale] = scales

    drawLegend(scales, canvas)
    var div = d3.select(".tooltip")
    canvas.selectAll(".county")
        .data(geoData)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("d", path)
        .attr("fill", function(d) {
            var result = education_data.find(function(education_data_obj) {
                    return education_data_obj.fips == d.id
                        //console.log(education_data_obj)
                })
                //console.log(result)
            return colorScale(result.bachelorsOrHigher)

        })
        .on("mouseover", function(d) {
            var result = education_data.find(function(education_data_obj) {
                return education_data_obj.fips == d.id
                    //console.log(education_data_obj)
            })
            console.log(result)
            div.transition().duration(10).style("opacity", 0.9)
                .style("top", d3.event.pageY + "px")
                .style("left", d3.event.pageX + "px")

            div.html("<p>    " + result.area_name + ", " +
                result.state + " : " + result.bachelorsOrHigher + "%  </p>")
        })
        .on("mouseout", function(d) {
            var result = education_data.find(function(education_data_obj) {
                return education_data_obj.fips == d.id
                    //console.log(education_data_obj)
            })
            div.transition().duration(100)
                .style("opacity", 0)
        })


}