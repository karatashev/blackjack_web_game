import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '../Button/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styles from "./DealRulesModal.module.css"

interface DealRulesProps {
  dealCards: () => void;
}

export default function DealRulesModal({ dealCards }: DealRulesProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <h2>BLACKJACK</h2>
            <Button
        text="START GAME"
        onClick={handleOpen}
        className={styles.start_game_button}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.box}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div className={styles.rules_container}>
              Blackjack is an incredibly popular, exciting and easy card game to
              play. The object is to have a hand with a total value higher than
              the dealer’s without going over 21. Kings, Queens, Jacks and Tens
              are worth a value of 10. An Ace has the value of 1 or 11. The
              remaining cards are counted at face value.
              <h4 style={{ margin: "10px 0" }}>HOW TO PLAY</h4>
              You and fellow players are dealt two cards each whilst the dealer
              is dealt one face up. If your first 2 cards add up to 21 (an Ace
              and a card valued 10), that’s Blackjack! If they have any other
              total, decide whether you wish to ‘draw’ or ‘stay’. You can
              continue to draw cards until you are happy with your hand. Once
              all players have taken their turn the dealer draws another card
              for their hand. They must draw until they reach 17 or more.
              <h4 style={{ margin: "10px 0" }}>RULES</h4>
              Once all cards are drawn, whoever has a total closer to 21 than
              the dealer wins. If player’s hand and dealer’s hand have an equal
              value, it’s a tie.
            </div>
          </Typography>
          <Button
            text="Deal cards"
            onClick={dealCards}
            className={styles.deal_cards_button}
          />
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
        </Box>
      </Modal>

    </div>
  );
}