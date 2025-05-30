import React from 'react';

function RouletteButton({ onClick, isLoading }) {
  return (
    <div className="roulette-button-container">
      <button className="roulette-button" onClick={onClick} disabled={isLoading}>
        {isLoading ? 'Memutar...' : 'Putar Roulette Decka!'}
      </button>
    </div>
  );
}

export default RouletteButton;