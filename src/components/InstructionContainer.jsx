import React from 'react';
import { FaInfoCircle, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import './InstructionContainer.css';

const InstructionContainer = ({ onClose }) => {
  return (
    <div className="instruction-container">
      <div className="instruction-header">
        <div className="branding">
          <h3><span className="airsight-brand">AirSight</span> <span className="by-iaqn">by IAQN</span></h3>
        </div>
      </div>
      
      <div className="instruction-content">
        <p className="instruction-intro">
          Welcome to AirSight! We analyze emission sources in your selected area and provide detailed environmental impact analysis.
        </p>
        
        <div className="instruction-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-text">🔍 Search for any Location & Click anywhere on the map to drop a pin at your location of interest</div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-text">📌 Click the <span className="highlight-button"><FaMapMarkerAlt /> Analyze Area</span> button to process the selected location</div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-text">🥳 View detailed analysis of emission sources and environmental impact</div>
          </div>
        </div>
      </div>
      
      <div className="instruction-footer">
        <div className="info-tip">
          <FaInfoCircle />
          <span>For best results, select urban or industrial areas with known emission sources</span>
        </div>
      </div>
    </div>
  );
};

export default InstructionContainer;