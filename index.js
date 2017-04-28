var dataLink = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 100
};

var width = 1000 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;
var colors = ['#5e4fa2', '#3288bd', '#66c2a5', '#abdda4', '#e6f598', '#ffffbf', '#fee08b', '#fdae61', '#f46d43', '#d53e4f', '#9e0142'];



var colorScale = d3.scaleQuantile().range(colors);

var chart = d3.selectAll('.chart')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('class', 'main')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var tool = d3.selectAll('.graph')
  .append('div')
  .attr('class', 'tool');

d3.json(dataLink, json => {

  var baseTemp = json.baseTemperature;
  var data = json.monthlyVariance;
  var yearExtent = d3.extent(data.map(d => +d.year));
  var monthExtent = d3.extent(data.map(d => +d.month));
  var gridWidth = (width / (yearExtent[1] - yearExtent[0]));
  // console.log(width, yearExtent[1] - yearExtent[0], gridWidth);
  var gridHeight = (height / 12);
  var varianceExtent = d3.extent(data.map(d => d.variance));

  //make axis
  var years = data.map(d => d.year);
  var uniqueYears = years.filter((d, pos) => years.indexOf(d) == pos);

  var yearLabels = chart.selectAll('.yearLabel')
    .data(uniqueYears)
    .enter().append('text')
    .text(d => d)
    .attr('class', 'yearLabel')
    .attr('x', (d, i) => i * gridWidth)
    .attr('y', 30)
    .style('visibility', d => d % 10 == 0 ? 'visible' : 'hidden')
    .style("text-anchor", "middle");

  //make axis
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthLabels = chart.selectAll('.monthLabel')
    .data(months)
    .enter().append('text')
    .text(d => d)
    .attr('class', 'monthLabel')
    .attr('x', -10)
    .attr('y', (d, i) => ((i + 1) * gridHeight) + gridHeight / 2)
    .attr('text-anchor', 'end')


  colorScale.domain(varianceExtent);

  chart.selectAll('.block')
    .data(data)
    .enter().append('g')
    .attr('transform', (d, i) => 'translate(' + (d.year - yearExtent[0]) * gridWidth + ',' + d.month * gridHeight + ')')
    .append('rect')
    .attr('fill', d => colorScale(d.variance))
    .attr('width', gridWidth)
    .attr('height', gridHeight)
    .on('mouseover', () => tool.style('display', null))
    .on('mouseout', () => tool.style('display', 'none'))
    .on('mousemove', d => {
      tool
        .style('display', 'inline-block')
        .style('left', d3.event.pageX + 30 + 'px')
        .style('top', d3.event.pageY + 'px')
        .html('<h3>' + (d.year) + '-' + ((d.month < 10) ? ('0' + d.month) : d.month) + '</h3>' +
          '<h4>' + d3.format('.2f')(baseTemp + d.variance) + '</h4>' +
          '<h5>' + d3.format('.2f')(d.variance) + '</h5>'
        )
    })
});