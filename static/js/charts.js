function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("./static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
//DELIVERABLE 1 
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("./static/js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.    
    var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
    //Need wfreq of wash for D3
    var metadata = data.metadata.filter(sampleObject => sampleObject.id == sample);
    //  5. Create a variable that holds the first sample in the array.
var result = filterArray[0];
//Need wfreq of wash for D3
var objectmetadata = metadata[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
var sample_values = result.sample_values;
var otu_ids = result.otu_ids;
var otu_labels = result.otu_labels;
//Need wfreq of wash for D3
var wfreq = objectmetadata.wfreq;




    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.

var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

var trace1 = {
    x: sample_values.slice(0,10).reverse(),
    y: yticks,
    text: otu_labels.slice(0,10).reverse(),
    name: "Belly Button Biodiversity Dashboard",
    type: "bar",
    //colorscale: '',
    orientation: "h"
};

    // 8. Create the trace for the bar chart.
    var barData = [trace1];
    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found ID " +sample,
      margin: {
  l: 100,
  r: 100,
  t: 100,
  b: 100
  }
};
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);

//DELIVERABLE 2 BUBBLE CHART
var trace2 = {
  x: otu_ids,
  y: sample_values,
  text: otu_labels,
  mode: 'markers',
  marker: {
  size: sample_values,
  color: otu_ids,
  colorscale: 'Jet'
  }
};

var bubbleData = [trace2];

var bubbleLayout = {
  title: 'Bacteria Cultures per Sample',
  showlegend: false,
  hovermode: 'closest',
  xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
  margin: {t:30}
};
Plotly.newPlot('bubble', bubbleData, bubbleLayout);




//DELIVERABLE 3 GAUGE

var gaugeData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    marker: {size: 28, color:'850000'},


    value: wfreq,

    title: 'Belly Button Weekly Washing Frequency <br> Scrubs per Week',
    type: "indicator",
    mode: "gauge+number",
    gauge: { axis: { range: [null, 10] },
            bar: { color: "black" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lime" },
            { range: [8, 10], color: "blue" },
          ]}
    }
];

var gaugeLayout = {
  width: 450,
  height: 400,
  margin: { t: 25, r: 25, l: 25, b: 25 },
  line: {
  color: '600000'
  },
  paper_bgcolor: "#white",
  font: { color: "#black" }
};
Plotly.newPlot("gauge", gaugeData, gaugeLayout);
});
}