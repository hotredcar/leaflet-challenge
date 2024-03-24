// 1. Get dataset
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// 2. Setup Environment 
// No specific JS setup required

// 3. Create Environment 
// No specific JS setup required

// 4. Write Javascript Code 
// Create funtion to initialize map
function initializeMap() {

    // Creating our initial map object:
    // We set the longitude, latitude, and starting zoom level.
    // This gets inserted into the div with an id of "map".
    let myMap = L.map('map', {
        center: [0, 70],
        zoom: 3
    });
  
    // Adding a tile layer (the background map image) to our map:
    // We use the addTo() method to add objects to our map.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    //Retrieve json earthquake data from url
    d3.json(url).then(data => {

        //console.log(data);
        //console.log(data.features);
        //console.log(data.features[0]);

        //  Loop through each earthquake 
          for (let index = 0; index < data.features.length; index++) {
             let feature = data.features[index];
             let coordinates = feature.geometry.coordinates; 
             let properties = feature.properties;

            // console.log(coordinates);
            // console.log(properties);

            // Create a marker for each earthquake
            // Scale marker size based on earthquake magnitude
            // Set marker color based on earthquake depth
            let marker = L.circleMarker([coordinates[1], coordinates[0]], {
                radius: properties.mag*3, 
                color: getColor(coordinates[2]), 
                fillOpacity: 0.7
            }).addTo(myMap);

            // Add a popup to the marker with specific earthquake information
            marker.bindPopup(`<b>${properties.place}</b><br>Magnitude: ${properties.mag}<br>Depth: ${coordinates[2]} km`);
          };
    });

    // Create a legend for the map
    let legend = L.control({ position: 'bottomright' });

    // Function to add the legend to the map
    legend.onAdd = function () {
        // Create a new div element with the 'info' and 'legend' classes
        let div = L.DomUtil.create('div', 'info legend');
        // Array to store the depth ranges
        let depths = [-10, 10, 30, 50, 70, 90];
        // Add a heading for the legend
        div.innerHTML += '<h4>Depth(km)</h4>';

         // Loop through each depth range
        for (let i = 0; i < depths.length; i++) {
            // Define the start of the current depth range
            let start = depths[i];
            // Define the end of the current depth range
            let end = depths[i+1] ? depths[i+1]:'+';
            
            // Add HTML content for each depth range to the legend
            div.innerHTML += 
            `<span class="legend-item">
            <span class="legend-color" style="background:${getColor(start)}"></span>
            <span class="legend-label">${start}-${end}</span>
            </span>`;
        }
     // Return the legend div   
    return div;
    };

    // Add the legend to the map
    legend.addTo(myMap);

}

// Function to determine the color based on the depth of the earthquake
function getColor(depth) {
    
    // Return color based on depth range
    return  depth >= 90 ? '#502689' : //purple for depth >= 90
            depth >= 70 ? '#BF0040' : //drak red for depth >= 90
            depth >= 50 ? '#DF0020' : //purple for depth >= 90
            depth >= 30 ? '#FF9300' : //purple for depth >= 90
            depth >= 10 ? '#FFE863' : //purple for depth >= 90
            '#FFC0CB';
}

// Function to initialize the map
initializeMap()
