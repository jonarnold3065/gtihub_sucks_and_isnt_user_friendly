var global_data = {};

$(document).ready(function() {
    getData();

    // EVENT listener for the table feature, 
    $("#selDataset").on("change", function() {
    
        build_charts();
    });
});

function getData() {
    let url = "samples.json";

    // AJAX
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        dataType: "json",
        success: function(data) {

            // DO WORK HERE
            console.log(data);
            global_data = data;
            build_charts();
            
        },
        error: function(data) {
            console.log("YOU BROKE IT!!");
        },
        complete: function(data) {
            console.log("Request finished");
        }
    });
}

function getData2() {
    let url = "samples.json";

    d3.json(url).then(function(data) {
        // DO WORK HERE
        console.log(data);
        build_charts()
    });
}

function build_charts() { 
    buildDropdown();
    buildBarPlot();
    buildTable();
    buildBubbleChart();
    buildGaugeChart();   
 }

function buildDropdown(data) {
    let names = global_data.names;  //extract the first name of 940 
    
    for (let i = 0; i < names.length; i++) {
        let name = names[i];
        let html_option = `<option value="${name}">${name}</option>`;
        $("#selDataset").append(html_option);
    }
};


    function buildTable(data) {
        let curr_id = parseInt($("#selDataset").val());
        let curr_data = global_data.metadata.filter(x => x.id === curr_id)[0];

        $("#sample-metadata").empty();  // searched far and wide for this little item, table wasnt working. 
    
        let items = Object.entries(curr_data).map(([key, value]) => `${key}: ${value}`);
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let html_text = `<p>${item}<p>`;
            $("#sample-metadata").append(html_text);
        };
    };

 // barchart function 
    function buildBarPlot(data) {
        let curr_id = $("#selDataset").val();
        let curr_data = global_data.samples.filter(x => x.id === curr_id)[0];
  
    // create trace
    let trace1 = {
        x: curr_data.sample_values.slice(0, 10).reverse(),
        y: curr_data.otu_ids.map(x => `ID: ${x}`).slice(0, 10).reverse(),
        text: curr_data.otu_labels.slice(0, 10).reverse(),
        name: "Bacteria Count",
        type: "bar",
        marker: {
            color: "rgb(108, 14, 185)" 
        },
        orientation: 'h'
    };


    // Create data array
    let traces = [trace1];

    // Apply a title to the layout
    let layout = {
        title: "Bacteria Count in Belly Button",
        xaxis: {
            title: "Number of Bacteria"
        }
    };

    Plotly.newPlot('bar', traces, layout);
}


function buildBubbleChart() {
    let curr_id = $("#selDataset").val();
    let curr_data = global_data.samples.filter(x => x.id === curr_id)[0];


    var trace1 = {
        x: curr_data.otu_ids,
        y: curr_data.sample_values,
        text: curr_data.otu_labels,
        mode: 'markers',
        marker: {
            color: curr_data.otu_ids,
            size: curr_data.sample_values,
            sizeref: 1.7,   
            colorscale: 'Electric',
        }
    };
      
    var traces = [trace1];

    var layout = {
        title: 'Bacteria Count in Belly Button Bubble Chart',
        showlegend: false,
        xaxis: {
            title: "Bacteria OTU ID"
        },
        yaxis: {
            title: "Number of Bacteria"
        }
    };

    Plotly.newPlot('bubble', traces, layout);
}



function buildGaugeChart() {
    let curr_id = parseInt($("#selDataset").val());
    let curr_data = global_data.metadata.filter(x => x.id === curr_id)[0];


        var trace1 = {
            domain: { x: [0, 1], y: [0, 1] },
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                { range: [0, 1], color: "red" },
                { range: [1, 3], color: "orange" },
                { range: [3, 5], color: "cyan" },
                { range: [5, 9], color: "rgb(108, 14, 185)" },
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 4
            }
        },
        delta: { reference: 4, increasing: { color: "RebeccaPurple" }},
        value: curr_data.wfreq,
        title: { text: "Clean Meter" },
        type: "indicator",
        mode: "gauge+number+delta"
    };

        var traces = [trace1];

        var layout = { 
            title: "Per Day Wash Frequency" 
        };

    Plotly.newPlot('gauge', traces, layout);
    
}
 
