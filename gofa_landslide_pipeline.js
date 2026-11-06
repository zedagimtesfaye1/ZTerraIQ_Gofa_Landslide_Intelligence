// =========================================================================
// PROJECT ONE: GAMO/GOFA ZONE LANDSLIDE ANTECEDENT CONDITIONS ANALYSIS
// MASTER DATA EXTRACTION PIPELINE (CLEANED & UNIFIED SCRIPT)
// =========================================================================

// --- SECTION 1: SPATIAL BOUNDARY DEFINITION ---
// We use ee.Geometry.Point to mark the precise longitude (36.83) and latitude (6.32) of the landslide site.
var landslidePoint = ee.Geometry.Point([36.83, 6.32]);

// We use the .buffer() function to generate a localized 15 km vector area circle for data clipping.
var studyArea = landslidePoint.buffer(15000); 

// Configure the user interface map display zoom factor to snap to our circle.
Map.centerObject(studyArea, 12);
Map.addLayer(studyArea, {color: 'blue'}, 'Gofa Landslide Study Area Boundary');

// --- SECTION 2: TOPOGRAPHY SENSOR LOADING & SLOPE CALCULATION ---
// We load the 30-meter global NASA SRTM elevation data model asset.
var globalDem = ee.Image("USGS/SRTMGL1_003");
var gofaElevation = globalDem.clip(studyArea);

// The ee.Terrain.slope() function measures the rate of elevation change for each pixel in degrees.
var gofaSlope = ee.Terrain.slope(gofaElevation);

// Define continuous display palettes for height (meters) and slope incline (degrees).
var elevationVis = {min: 1000, max: 3000, palette: ['green', 'yellow', 'white']};
var slopeVis = {min: 0, max: 45, palette: ['blue', 'orange', 'red']};

Map.addLayer(gofaElevation, elevationVis, 'Gofa Terrain Elevation (Meters)');
Map.addLayer(gofaSlope, slopeVis, 'Gofa Hillside Slope (Degrees)');

// --- SECTION 3: CHIRPS HISTORICAL PRECIPITATION INTEGRATION ---
// We call the daily CHIRPS collection asset containing rainfall data in millimeters per day.
var dailyRainfallCollection = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY");
var criticalRainPeriod = dailyRainfallCollection.filterDate('2026-01-01', '2026-03-31');

// We use the ee.Reducer.sum() algorithm to add up all daily rainfall slices into a single total image asset.
var totalAccumulatedRain = criticalRainPeriod.sum().clip(studyArea);

// Define a sequential blue visualization scale representing light to severe water saturation totals.
var rainVis = {
  min: 150,  // 150 mm cumulative rainfall (moderate)
  max: 500,  // 500 mm cumulative rainfall (extreme storm trigger core)
  palette: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
};
Map.addLayer(totalAccumulatedRain, rainVis, 'Accumulated Rainfall Jan-Mar 2026 (mm)', false);

// --- SECTION 4: INTERNATIONAL STANDARDIZED UI LEGEND PANEL ---
// We use ui.Panel here to create a floating map widget window box for our legend components.
var legendPanel = ui.Panel({
  style: {
    position: 'bottom-left', 
    padding: '8px 15px',     
    backgroundColor: 'white' 
  }
});

var legendTitle = ui.Label({
  value: 'Gofa Landslide Topography Guide',
  style: {fontWeight: 'bold', fontSize: '14px', margin: '0 0 6px 0'}
});
legendPanel.add(legendTitle);

// Helper function to build a standardized color row component inside the container panel.
function addLegendRow(color, text) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color, 
      padding: '8px',         
      margin: '0 6px 4px 0'
    }
  });
  
  var descriptionText = ui.Label({
    value: text,
    style: {margin: '0 0 4px 0', fontSize: '12px'}
  });
  
  var rowPanel = ui.Panel({
    widgets: [colorBox, descriptionText],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
  
  legendPanel.add(rowPanel);
}

// Populate the visual legend grid rows to translate our terrain metrics clearly.
legendPanel.add(ui.Label({value: 'Slope Hazard Level:', style: {fontWeight: 'bold', fontSize: '11px'}}));
addLegendRow('red', 'High Slope (>30°): Mass Movement Extreme Risk Face');
addLegendRow('orange', 'Moderate Slope (15°-30°): Unstable Soil Friction Zone');
addLegendRow('blue', 'Flat Valley Ground (0°-15°): Runoff Deposition Floor');

legendPanel.add(ui.Label({value: 'Elevation Matrix:', style: {fontWeight: 'bold', fontSize: '11px', margin: '6px 0 0 0'}}));
addLegendRow('white', 'High Alpine Ridges (2,000 - 3,000 Meters Above Sea Level)');
addLegendRow('yellow', 'Middle Plateau Slopes (1,500 - 2,000 Meters Above Sea Level)');
addLegendRow('green', 'Low Inundation Basins (1,000 - 1,500 Meters Above Sea Level)');

// Attach the fully compiled legend object structure onto the active Map canvas screen area.
Map.add(legendPanel);
