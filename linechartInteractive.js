var parseDate = d3.timeParse("%Y%m%d");

d3.csv(
  "tempdata.csv",
  function(d) {
    return {
      date: parseDate(d.date),
      newyork: +d.newyork,
      sfo: +d.sanfrancisco,
      austin: +d.austin
    };
  },
  linechart
);

function linechart(data) {
  //============Wrangling Data for Creating Multi_Line Visualization===================
  var austin = [];
  var newyork = [];
  var sfo = [];

  data.forEach(element => {
    austin.push({ date: element.date, temp: element.austin });
    newyork.push({ date: element.date, temp: element.newyork });
    sfo.push({ date: element.date, temp: element.sfo });
  });

  series = [
    { id: "austin", value: austin },
    { id: "newyork", value: newyork },
    { id: "sfo", value: sfo }
  ];
  //==============Wrangling Data for Creating Multi_Line Visualization================

  console.log(series);

  //We are using newyork for dates because all three lists have same dates
  var maxDate = d3.max(newyork, function(d) {
    return d.date;
  });
  var minDate = d3.min(newyork, function(d) {
    return d.date;
  });
  //Nested max calculation
  var maxTemp = d3.max(series, function(arrays) {
    return d3.max(arrays.value, function(d) {
      return d.temp;
    });
  });

  var width = 1200;
  var height = 800;
  var margin = {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30
  };

  var svg = d3
    .select("body")
    .select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var chartGroup = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .range([0, width]);

  var yScale = d3
    .scaleLinear()
    .domain([0, maxTemp])
    .range([height - margin.bottom - margin.top, 0]);

  //Adding categorical color scale
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis = d3.axisBottom(xScale);
  chartGroup
    .append("g")
    .attr("class", "x axis")
    .attr(
      "transform",
      "translate(0, " + (height - margin.bottom - margin.top) + ")"
    )
    .call(xAxis);

  var yAxis = d3.axisLeft(yScale);
  chartGroup
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0, 0)")
    .call(yAxis);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var line = d3
    .line()
    .x(function(d) {
      return xScale(d.date);
    })
    .y(function(d) {
      return yScale(d.temp);
    });

  chartGroup
    .append("g")
    .selectAll("path")
    .data(series)
    .enter()
    .append("path")
    .attr("d", function(d, i) {
      return line(d.value);
    })
    .style("stroke", function(d, i) {
      return color(d.id);
    })
    .attr("class", "dataLine")
    .attr("id", function(d) {
      return d.id;
    })
    .on("mouseover", function(d) {
      // Selected Element
      d3.select("#info")
        .attr("x", d3.mouse(this)[0] + 10)
        .attr("y", d3.mouse(this)[1] + 15)
        .style("display", "")
        .text(d.id);
      //Reduce opacity of all the paths
      d3.selectAll("path").attr("opacity", "0.1");
      //Restore the opacity of selected path
      d3.select("#" + d.id).attr("opacity", "1");
    })
    .on("mouseout", function(d) {
      // Remove Label
      d3.select("#info").style("display", "none");

      //Restore the opacity of all paths
      d3.selectAll("path").attr("opacity", "1");
    });

  // Adding a text element to show the city name
  chartGroup
    .append("text")
    .attr("id", "info")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "30px")
    .style("background-color", "white")
    .style("display", "none");

  //Handling SelectBox OnChange
  var selectbox = d3.select("#selectbox").on("change", function() {
    if (this.value == "all") {
      d3.selectAll("path").attr("opacity", "1");
    } else {
      //Reduce opacity of all the paths
      d3.selectAll("path").attr("opacity", "0.1");
      //Restore the opacity of selected path
      d3.select("#" + this.value).attr("opacity", "1");
    }
  });
}
