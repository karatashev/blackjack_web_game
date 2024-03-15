import { CardFace } from "../../types";

export const checkForWinner = (
  addPlayersCards: CardFace[],
  addDealersCards: CardFace[],
  setGameEnded: (value: boolean) => void,
  setResult: (value: string) => void,
  sumCards: (cards: CardFace[]) => number
) => {
  // Calculate player score
  const playerScore = sumCards(addPlayersCards);

  // Calculate dealer score
  const dealerScore = sumCards(addDealersCards);
  console.log(playerScore, "final players score");
  console.log(dealerScore, "final dealers score");

  if (playerScore === 21 && dealerScore < 21) {
    setGameEnded(true);
    setResult("BLACKJACK PLAYER WINS");
  } else if (dealerScore === 21 && playerScore < 21) {
    setGameEnded(true);
    setResult("BLACKJACK DEALER WINS");
  } else if (dealerScore > 21 && playerScore <= 21) {
    setGameEnded(true);
    setResult("PLAYER WINS");
  } else if (playerScore > dealerScore && playerScore <= 21) {
    setGameEnded(true);
    setResult("PLAYER WINS");
  } else if (dealerScore > playerScore && dealerScore <= 21) {
    setGameEnded(true);
    setResult("DEALER WINS");
  } else if (playerScore > 21 && dealerScore <= 21) {
    setGameEnded(true);
    setResult("BUST! DEALER WINS");
  } else {
    setGameEnded(true);
    setResult("DRAW");
  }
};
