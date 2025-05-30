import React from 'react';

function ResultDisplay({ location }) {
  return (
    <div className="result-display">
      <h3>Decka sebaiknya ke:</h3>
      <p className="result-location">{location || "..."}</p>
    </div>
  );
}

export default ResultDisplay;