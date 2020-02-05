# In-Class Programming: D3 Line Chart
In this activity, you are going to create a line-chart using D3.  Please publish to github pages and post the link here.

GITHUB_PAGES_LINK

## Setup
1. Clone this repository to your local machine. E.g., in your terminal / command prompt `CD` to where you want this the folder for this activity to be. Then run `git clone <YOUR_REPO_URL>`

1. `CD` or open a terminal / command prompt window into the cloned folder.

1. Start a simple python webserver. E.g., `python -m http.server`, `python3 -m http.server`, or `py -m http.server`. If you are using python 2 you will need to use `python -m SimpleHTTPServer` instead, but please switch to python 3.

1. Wait for the output: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)`.

1. Now open your web browser (Firefox or Chrome) and navigate to the URL: http://localhost:8000

## JavaScript Loading
1. Open `index.html`. Just below this HTML comment:
```html
<!-- Load the d3.js library( version 4 ) -->
```
add this line to load the D3 javascript code (note the version number v4):
```html
<script src="d3.v4.js"></script>
```
1. You also have a file `linechart.js`. We want to load this javascript code as well. In `index.html`, just below this HTML comment:
```html
<!-- Load the line.js file -->
```
add this line:
```html
<script src="linechart.js"></script>
```

## Data Loading and Parsing

1. Open the file `data.csv` **with a text editor** and see what is inside. It is comma-separated. You will see a header row followed by several data rows with a date in the MM/D/YYYY format, e.g., `10/6/2018`, and a price, e.g., `33.9`. Note that you can open CSV files with Excel or other clever tools but they can make mistakes with parsing the data into their own formats.

1. In `linechart.js` we are going to load this CSV file. Add this line to use D3 to load the file and then pass it to a callback function inside `then`:
```javascript
d3.csv("data.csv").then(function(data) {
  console.log(data);
});
```
Once the data is loaded from the CSV file it is stored in the `data` variable. Your entire code for creating the line chart will go here inside the `then` function which happens after the data is asynchronously loaded.

1. In your browser (Firefox or Chrome), open the browser developer tools by pressing `CTRL`+`SHIFT`+`I` (Windows/Linux) or `Cmd`+`Opt`+`I` and select the `Console` view. Here is where you see any output from `console.log` or any other [`console` messages](https://developer.mozilla.org/en-US/docs/Web/API/Console) such as errors. The browser developer tools and the `Console` view are very useful for debugging. Here you can see the that your code logged an array of 50 objects to the console. If you see this, your data has loaded!

1. However, if you interact with the object by clicking the triangles you will notice that the date and price are enclosed in double-quotes (") and are thus strings. This is not the format that we want our data to be in for us to interpret it properly. Hence we need to parse the data into the formats we want. To learn about date parsing visit this site: http://learnjsdata.com/time.html

1. To parse our date data to the format we want, we are going to define a variable called `parseDate` **before** the step where we loaded our data:
```javascript
var parseDate = d3.timeParse('%m/%d/%Y');
```
Because our dates use forward slashes `/` as delimiters, our format string includes them. If our date was instead `02-02-2009`, we would parse it using `%m-%d-%Y`.

1. Now we can use `parseDate` to parse our dates and we can use the built-in unary `+` operator to parse our numbers. Modify your call to `d3.csv` like so, passing an anonymous row conversion function that does the parsing:
```javascript
d3.csv('data.csv', function(d) {
  return {
    date: parseDate(d.date),
    price: +d.price
  };
}).then(function(data) {
  console.log(data);
});
```

## Line Chart

1. Instead of writing everything inside the `then` function of `d3.csv`, lets create a new function that creates our line chart given some data:
```javascript
function lineChart(data){
  console.log(data);
}
```
and replace the anonymous function inside `then` with our new function, like so:
```javascript
d3.csv("data.csv", function(d) {
  return {
    date: parseDate(d.date),
    price: +d.price
  };
}).then(lineChart);
```

1. In order to have the proper scales for your line chart, you need to know the max and min of your data. This is easy to do manually for static, small datasets but in general this is cumbersome, error-prone, and can be done instead algorithmically. Add these lines after the `console.log` in `lineChart`:
```javascript
  var maxDate  = d3.max(data, function(d){return d.date; });
  var minDate  = d3.min(data, function(d){return d.date; });
  var maxPrice = d3.max(data, function(d){return d.price;});
  console.log(maxDate, minDate, maxPrice);
```

1. In your browser `Console` view check whether those variables have been set. The `console.log`  is for your own assurance that your variable is indeed returning the value that you are asking for. You can remove this later.

1. Check to see if you can see those variables in the browser debugger instead (`Debugger` in Firefox, `Sources` in Chrome). Open `linechart.js` in the debugger. Click on the line number beside the closing parenthesis `}` of the `lineChart` function to create a breakpoint. Refresh the browser page. You should see the variable values at this point inside the `Scopes` view (Firefox) or `Scope` view (Chrome). Chrome also shows the values in-line. You can click the `Resume` button (right-facing triangle, e.g. a play button) to resume execution. Remove the breakpoint by clicking the line number again.

1.  Define the `width` and `height` for the `svg` you will use:
```javascript
var width  = 600;
var height = 500;
var margin = {
  top: 30,
  bottom: 30,
  left: 30,
  right: 30
};
```

For each of the following steps, you can save your file and reload the page in your web browser to see what has changed.

1. Now, create your `svg` inside the `body` in the DOM by using D3 to `select` the `body` and `append` the `svg`, giving it a `width`, `height`, and `background` color:
```javascript
var svg = d3.select('body')
  .append('svg')
    .attr('width' , width)
    .attr('height', height)
    .style('background', '#efefef');
```

1. Then create an SVG group `g` for all the elements that will make up our line chart.
```javascript
var chartGroup = svg
  .append('g')
    .attr('transform','translate(' + margin.left +',' + margin.top + ')');
```

1. Now we will define two scales for the x (`d3.scaleTime`) and y (`d3.scaleLinear`) axes and set their `domain` (in the data) and `range` (on the screen):
```javascript
var xScale = d3.scaleTime()
  .domain([minDate, maxDate])
  .range([0, width]);
```
```javascript
var yScale = d3.scaleLinear()
  .domain([0, maxPrice])
  .range([height - margin.bottom - margin.top, 0]);
```

1. Then we can draw our axes using these scales:
```javascript
var xAxis = d3.axisBottom(xScale);
chartGroup.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
  .call(xAxis);
```
```javascript
var yAxis = d3.axisLeft(yScale);
chartGroup.append('g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(0, 0)')
  .call(yAxis);
```

1. Finally, we will draw the line:
```javascript
var line = d3.line()
  .x(function(d){return xScale(d.date);})    
  .y(function(d){return yScale(d.price);})
```
```javascript
chartGroup.append('path')
  .attr('d', line(data));
```

1. At this point, if you save and reload in your browser you will see that your line looks rather bizarre. This is because by default the line is filled with black and it is trying to close the polygon. Let's add CSS to fix this.

1. First, add a CSS class to the lines we want to style (adding to the original code):
```javascript
chartGroup.append('path')
  .attr('d', line(data))
  .attr('class', 'dataLine');
```
Then, in `linechart.css` add these lines:
```CSS
.dataLine{
	stroke: #0000BB;
	stroke-width: 1px;
	fill: none;
}
```

Congratulations! You should now have a line chart. What else can you do with this by playing with JavaScript, HTML, and CSS?

Here are some ideas, which may require some research.  First, commit your finished bar chart.  Then, if you have time in class, try out at least one of them.  If you can't get it to work, make sure that you clean up any changes you made so that the web page still renders.  Then, publish to github pages and add the link at the top of this readme.

In general, the d3 v4 documentation will be helpful.  https://devdocs.io/d3~4/

- Use some CSS to make it look more professional.  You can try adding a container around the line chart with some padding and a border, to push it to the foreground.  To learn more about CSS, look at Mozilla's Developer Network documentation https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps.  You can also try to integrate some sort of styling library like [bootstrap](https://getbootstrap.com/docs/4.4/examples/).
- Change the axes to display ticks every 10 dollars on the y Axis and only have ticks for each new month on the y axis.  Look at the tickFormat options in the axis documentation.  
- Change the background color from #efefef to a color that uses the HSL space.
- Search for examples of line charts on https://blockbuilder.org/search and try to copy some interesting function from an example.  Make sure to filter to d3 v4.