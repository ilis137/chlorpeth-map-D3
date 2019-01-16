var width = 1000,
    height = 600,
    margin = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
var USA_GEO_DATA_JSON = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
var USA_EDUCATION_DATA_JSON = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"
var DATA_URLS = [USA_GEO_DATA_JSON, USA_EDUCATION_DATA_JSON]
var projection = d3.geoMercator()

var path = d3.geoPath()

const URL = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
document.addEventListener("DOMContentLoaded", function(e) {

    Promise.all(DATA_URLS.map(url => d3.json(url))).then(processData);

    //d3.json(URL).then(processData)




})

function processData(data) {
    console.log(data)
    var [geo_data, education_data] = data
    var counties = topojson.feature(geo_data, geo_data.objects.counties).features

    drawGraph(counties)

    console.log(counties)
}

function drawGraph(graphdata) {
    var canvas = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    canvas.selectAll(".county").data(graphdata).enter().append("path").attr("class", "county")
        .attr("d", path)
}