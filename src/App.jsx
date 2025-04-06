import React, { useState } from 'react';
import axios from 'axios';
import Mapview from './components/Mapview';
import './App.css';
import ScrollableCards from './components/ScrollableCards';
import InstructionContainer from './components/InstructionContainer';
import LoadingOverlay from './components/LoadingOverlay';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

// In your App component, add the AirQualityCard before the Mapview
function App() {
  const [coordinates, setCoordinates] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isPOIInteraction, setIsPOIInteraction] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);  // Control instruction container visibility
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];
  const API_URL = "https://airsightapi.iaqn.org";

  // Expose handleSearch globally so it can be called from Mapview
  window.handleSearch = async () => {
    if (!coordinates) {
      setError('Please select a location on the map first.');
      return;
    }
    
    setLoading(true);
    setError(null);
    // Only hide instructions when Analyze Area button is clicked, which calls this function
    setShowInstructions(false);
    try {
      const response = await axios.post(`${API_URL}/analyze-area`, {
        longitude: coordinates.lng,
        latitude: coordinates.lat,
        radius: 5, // 5km radius
        include_factors: true, // Request detailed environmental factors
        include_comparison: true // Request comparison with similar areas
      });
      console.log("Analysis response:", response.data);
      
      setAnalysis(response.data);
      setResults({
        pois: response.data.pois || {},
        geocode: response.data.geocode || {},
        bbox: response.data.bbox || null,
        boundary_polygon: response.data.boundary_polygon || null,
        geojson: response.data.geojson || null
      });
      setShowAnalysis(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.detail || 'An error occurred while fetching data.');
      // We don't clear coordinates here, so user can try again without selecting a new location
    } finally {
      setLoading(false);
    }
  };
  const handleNewAnalysis = () => {
    setCoordinates(null);
    setResults(null);
    setAnalysis(null);
    setShowAnalysis(false);
    setError(null);
    setShowInstructions(true); // Show instructions when starting a new analysis
  };
  
  // Function to handle coordinates selected from map
  const handleCoordinatesSelected = (lng, lat) => {
    setCoordinates({ lng, lat });
    // Don't hide instructions when user drops a pin - only hide when Analyze Area is clicked
  };
  
  // Function to handle closing the instruction container
  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  // Remove the local calculateScore function since we'll get the score from the LLM

  return (
    <div className="app-container">
      {!showAnalysis ? (
        // Initial view with map for pin dropping
        <>
          <div className="map-container">
            <Mapview 
              results={null} 
              pieChartData={null} 
              colors={COLORS}
              weatherData={null}
              onCoordinatesSelected={handleCoordinatesSelected}
              isPOIInteraction={isPOIInteraction}
              setIsPOIInteraction={setIsPOIInteraction}
            />
            {showInstructions && (
              <div className="instruction-wrapper">
                <InstructionContainer onClose={handleCloseInstructions} />
              </div>
            )}
          </div>
          {loading && <LoadingOverlay isVisible={loading} />}
        </>
      ) : (
        <>
          <div className="map-container">
            <Mapview 
              results={results} 
              pieChartData={analysis?.pie_chart_data} 
              colors={COLORS}
              weatherData={analysis?.weather}
              onCoordinatesSelected={null}
              isPOIInteraction={isPOIInteraction}
              setIsPOIInteraction={setIsPOIInteraction}
            />
          </div>
          
          <ScrollableCards 
            analysis={analysis} 
            city={analysis?.geocode?.city || 'Selected Area'} 
            area={analysis?.geocode?.area || 'Custom Location'} 
            handleNewAnalysis={handleNewAnalysis} 
          />
        </>
      )}
    </div>
  );
}
export default App;