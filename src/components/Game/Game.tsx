import { useEffect, useReducer, useState } from "react";
import Card from "../Card/Card";
import convertToNum from "../../utils/convertValues"
import styles from "./Game.module.css"
import ResultModal from "../Modal/ResultModal";
import Button from "../Button/Button";
import DealRulesModal from "../Modal/DealRulesModal";
import Loader from "../Loader/Loader";
import { FaHandPaper } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";
import { checkForWinner } from "../../utils/checkForWinner";
import { CardFace } from "../../../types"
import reducer from "../../utils/reducer/reducer"
import { initialState } from "../../utils/reducer/reducer";
import { ADD_DEALERS_CARDS, ADD_PLAYERS_CARDS, SET_DEALER_FIRST_CARD_SRC, SET_DEALER_SCORE, SET_DECK_ID, SET_PLAYER_SCORE, SET_RESULT } from "../../utils/reducer/ActionTypes";



// BlackjackGame Component
const BlackjackGame: React.FC = () => {
  // const [result, setResult] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [gameIsStarting, setGameIsStarting] = useState(true)
  const [loading, setLoading] = useState(false)

  const [state, dispatch] = useReducer(reducer, initialState);



  useEffect(() => {
    const getDeck = async () => {
      try {
        const res = await fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2");
        const data = await res.json();
        dispatch({ type: SET_DECK_ID, payload: data.deck_id })
        // setDeckId(data.deck_id);
      } catch (err) {
        console.log(err);
      }
    };
    getDeck();
  }, []);

  const getCard = async () => {
    try {
      if (!state.deckId) {
        console.log('Deck ID is not available');
        return null;
      }
  
      const res = await fetch(`https://deckofcardsapi.com/api/deck/${state.deckId}/draw/?count=1`);
      const data = await res.json();
      return data.cards[0];
    } catch (err) {
      console.log(err);
    }
  };
  

  const dealCards = async () => {
    setLoading(true)
    setGameIsStarting(false)
    const playerCardOne = await getCard();
    const dealerCardOne = await getCard();
    const playerCardTwo = await getCard();
    const dealerCardTwo = await getCard();
    
  
     // Set dealer's first card to back of card image
    //  setDealerFirstCardSrc("https://opengameart.org/sites/default/files/card%20back%20red.png");
    dispatch({ type: SET_DEALER_FIRST_CARD_SRC, payload: initialState.dealerFirstCardSrc})

    dispatch({ type: ADD_DEALERS_CARDS, payload: [dealerCardOne, dealerCardTwo]})
    // setAddDealersCards(prevCards => [...prevCards, dealerCardOne, dealerCardTwo]);

    dispatch({ type: ADD_PLAYERS_CARDS, payload: [playerCardOne, playerCardTwo]})
    // setAddPlayersCards(prevCards => [...prevCards, playerCardOne, playerCardTwo]);


    // Calculate and set dealer score (show only second card)
    const dealerSecondCardValue = convertToNum(dealerCardTwo.value);
    dispatch({ type: SET_DEALER_SCORE, payload: dealerSecondCardValue})
    // setDealerScore(dealerSecondCardValue);


  
    // Calculate and set player score
    const playerCardsSum = sumCards([playerCardOne, playerCardTwo]);
    // setPlayerScore(playerCardsSum);
    dispatch({ type: SET_PLAYER_SCORE, payload: playerCardsSum})

    
  
    // Check for Blackjack
    if (playerCardsSum === 21) {
      flipDealersCard()
      checkForWinner(state.addPlayersCards, state.addDealersCards, setGameEnded, dispatch, sumCards)

    }
    setLoading(false)
  };




  const flipDealersCard = () => {
    if (state.addDealersCards && state.addDealersCards.length > 0) {
      const firstCardImage = state.addDealersCards[0].image;
      console.log("First card image:", firstCardImage);

      // setDealerFirstCardSrc(firstCardImage);
      dispatch({ type: SET_DEALER_FIRST_CARD_SRC, payload: firstCardImage });

      // Calculate and set sum of dealer's cards
      const dealerCardsSum = sumCards(state.addDealersCards);
      dispatch({ type: SET_DEALER_SCORE, payload: dealerCardsSum})
      // setDealerScore(dealerCardsSum);
      console.log(dealerCardsSum, "dealers first two cards sum");
    }
    // Check for Blackjack
    if (state.dealerScore === 21) {
      checkForWinner(
        state.addPlayersCards,
        state.addDealersCards,
        setGameEnded,
        dispatch,
        sumCards
      );
    }
  };
  
  console.log(state.dealerScore, 'DEALERS SCORE <=========')
            



  
  console.log(state.addDealersCards, 'dealers')
  console.log(state.addPlayersCards, 'players')
  console.log(state.dealerScore, 'DEALER SCORE')
  console.log(state.playerScore, 'PLAYER SCORE')





  const hit = async () => {
    const newPlayerCard = await getCard();
    // setAddPlayersCards([...addPlayersCards, newPlayerCard]);
    dispatch({ type: ADD_PLAYERS_CARDS, payload: [...state.addPlayersCards, newPlayerCard]})


    // Calculate and set player score
    const playerCardsSum = sumCards([...state.addPlayersCards, newPlayerCard]);
    // setPlayerScore(playerCardsSum);
    dispatch({ type: SET_PLAYER_SCORE, payload: playerCardsSum})

    
  
    // Check for Bust
    if (playerCardsSum >= 21) {
      flipDealersCard()
      checkForWinner(state.addPlayersCards, state.addDealersCards, setGameEnded, dispatch, sumCards);
    }
  };



  const stand = async () => {
    // Flip the dealer's first card
    flipDealersCard();
  
    // Recalculate dealer score
    const updatedDealerCards = [...state.addDealersCards];
    let dealerCardsSum = sumCards(updatedDealerCards);
  
    // If the dealer's score is already 17 or higher, check for winner
    if (dealerCardsSum >= 17) {
      checkForWinner(state.addPlayersCards, state.addDealersCards, setGameEnded, dispatch, sumCards);
    } else {
      // Keep drawing cards for the dealer until their total sum is 17 or higher
      while (dealerCardsSum < 17) {
        const newDealerCard: CardFace = await getCard();
        updatedDealerCards.push(newDealerCard);
        
        // Calculate the sum of all dealer's cards including the newly drawn card
        dealerCardsSum = sumCards(updatedDealerCards);
        
        // Update the dealer's score
        dispatch({type: ADD_DEALERS_CARDS, payload: updatedDealerCards})
        // setAddDealersCards(updatedDealerCards);

        dispatch({ type: SET_DEALER_SCORE, payload: dealerCardsSum})
        // setDealerScore(dealerCardsSum);
      }
  
      // Check for winner after the dealer stops drawing cards
      checkForWinner(state.addPlayersCards, state.addDealersCards, setGameEnded, dispatch, sumCards);
    }
  };
    
  
  

  // SUM CARDS
  //We sort the cards in descending order (b - a). This is important because we want to check for the ace value before any other card value.
  //We iterate over the sorted cards and apply the same logic as before, dynamically choosing the ace value to avoid busting.
  //This way, the ace value is chosen intelligently, just like in your previous JavaScript code.
  function sumCards(cards: CardFace[]): number {
    let hasAce = false;
    let sum = cards
      .map(card => convertToNum(card.value))
      .sort((a, b) => b - a) // Sort cards in descending order
      .reduce((sum, current) => {
        if (current === 11) {
          hasAce = true;
        }
        return sum + current;
      }, 0);
  
    // If there is an Ace and the sum is above 21, adjust the sum
    if (hasAce && sum > 21) {
      sum -= 10;
    }
  
    return sum;
  }
  
  
  
  
  useEffect(() => {
    // Call the checkForWinner function when the player's cards state changes
    if (gameEnded) {
      checkForWinner(state.addPlayersCards, state.addDealersCards, setGameEnded, dispatch, sumCards);
    }
  }, [state.addPlayersCards, state.addDealersCards, gameEnded]); // Watch for changes in the player's cards state



  const startGameAgain = () => {
    // Reset any necessary state variables to start a new game
    dispatch({ type: ADD_DEALERS_CARDS, payload: [] })
    // setAddDealersCards([])

    // setAddPlayersCards([])
    dispatch({ type: ADD_PLAYERS_CARDS, payload: [] })

    dispatch({ type: SET_DEALER_SCORE, payload: 0 })
    // setDealerScore(0)
    dispatch({ type: SET_PLAYER_SCORE, payload: 0 })
    // setPlayerScore(0)
    dispatch({ type: SET_RESULT, payload: initialState.result })
    // setResult('')
    setGameEnded(false)
    dealCards()
  };

  console.log(gameEnded, 'game ended')


  return (
    <>
      {gameIsStarting ? (
        <DealRulesModal dealCards={dealCards} />
      ) : (
        <div className={styles.blackjack_game}>
          {/* Render cards */}

          {loading ? (
            <Loader />
          ) : (
            <div className={styles.both_sides_container}>
              <div className={styles.container}>
                <h3>DEALER</h3>
                <div className={styles.score}>{state.dealerScore}</div>
                <div className={styles.cards_wrapper}>
                  {state.addDealersCards.map((card: CardFace, index: any) => (
                    <Card
                      key={index}
                      image={index === 0 ? state.dealerFirstCardSrc : card.image}
                      value={card.value}
                      isDealer={true}
                      isFirst={index === 0}
                      dealerFirstCardSrc={state.dealerFirstCardSrc} // Pass dealerFirstCardSrc as a prop
                    />
                  ))}
                </div>
              </div>

              {gameEnded && (
                <ResultModal
                  result={state.result}
                  startGameAgain={startGameAgain}
                  dealerScore={state.dealerScore}
                  playerScore={state.playerScore}
                />
              )}

              <div className={styles.container}>
                <div className={styles.cards_wrapper}>
                  {state.addPlayersCards.map((card: CardFace, index: any) => (
                    <Card
                      key={index}
                      image={card.image}
                      value={card.value}
                      isDealer={false}
                      isFirst={index === 0}
                      dealerFirstCardSrc={""} // Pass dealerFirstCardSrc as a prop
                    />
                  ))}
                </div>

                <div className={styles.score}>{state.playerScore}</div>
                <h3>PLAYER</h3>
              </div>
            </div>
          )}

          {/* Render buttons */}
          <div className={styles.buttons_container}>
            {gameIsStarting && (
              <Button
                className={styles.deal_cards_button}
                onClick={dealCards}
                text="Deal"
                disabled={false}
              />
            )}

            {!gameIsStarting && loading ? null : (
              <>
                <Button
                  className={styles.hit_button}
                  onClick={hit}
                  icon={<MdPersonAddAlt1 />}
                  text="Hit"
                  disabled={gameEnded}
                />
                <Button
                  className={styles.stand_button}
                  onClick={stand}
                  text="Stand"
                  icon={<FaHandPaper />}
                  disabled={gameEnded}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BlackjackGame;