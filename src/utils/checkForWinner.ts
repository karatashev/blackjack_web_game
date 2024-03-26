import { CardFace } from "../../types";
import { SET_RESULT } from "./reducer/ActionTypes"; // Assuming SET_RESULT is the action type for updating the result

export const checkForWinner = (
  addPlayersCards: CardFace[],
  addDealersCards: CardFace[],
  setGameEnded: (value: boolean) => void,
  dispatch: (action: { type: string, payload: any }) => void, // Add dispatch function from the reducer
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
    dispatch({ type: SET_RESULT, payload: "BLACKJACK PLAYER WINS" });
  } else if (dealerScore === 21 && playerScore < 21) {
    setGameEnded(true);
    dispatch({ type: SET_RESULT, payload: "BLACKJACK DEALER WINS" });
  } else if (dealerScore > 21 && playerScore <= 21) {
    setGameEnded(true);
    dispatch({ type: SET_RESULT, payload: "PLAYER WINS" });
  } else if (playerScore > dealerScore && playerScore <= 21) {
    setGameEnded(true);
    dispatch({ type: SET_RESULT, payload: "PLAYER WINS" });
  } else if (dealerScore > playerScore && dealerScore <= 21) {
    setGameEnded(true);
    dispatch({ type: SET_RESULT, payload: "DEALER WINS" });
  } else if (playerScore > 21 && dealerScore <= 21) {
    setGameEnded(true);
    dispatch({ type: SET_RESULT, payload: "BUST! DEALER WINS" });
  } else {
    setGameEnded(true);
    dispatch({ type: SET_RESULT, payload: "DRAW" });
  }
};
