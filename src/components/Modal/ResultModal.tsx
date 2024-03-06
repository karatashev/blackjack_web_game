// ResultModal.js
import React from 'react';

const ResultModal = ({ result, startNewGame }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>Game Result: {result}</p>
        <button onClick={startNewGame}>Start New Game</button>
      </div>
    </div>
  );
};

export default ResultModal;
