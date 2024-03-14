import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '../Button/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styles from "./ResultModal.module.css"


export default function ResultModal({result, startGameAgain, playerScore, dealerScore}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div>
      <h3 className={styles.result}>{result}</h3>
      <Button
            text="New game"
            onClick={handleOpen}
            className={styles.new_game_button}
          />
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.box}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <p>Dealer had: {dealerScore}</p>
            <p>Player had: {playerScore}</p>
            <p>{result}</p>
          </Typography>
          <Button
            text="Start again"
            onClick={startGameAgain}
            className={styles.start_again_button}
          />

        </Box>
      </Modal>
    </div>
  );
}