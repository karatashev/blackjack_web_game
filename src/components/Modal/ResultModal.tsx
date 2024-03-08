// ResultModal.js
import styles from "./ResultModal.module.css"


const ResultModal = ({ result, startNewGame }) => {
  return (
    <div className={styles.modal_container}>
      <div className={styles.modal_content}>
        <p>{result}</p>
        <button onClick={startNewGame}>Start New Game</button>
      </div>
    </div>
  );
};

export default ResultModal;
