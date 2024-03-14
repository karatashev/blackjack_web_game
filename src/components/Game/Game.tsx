import { useEffect, useState } from "react";
import Card from "../Card/Card";
import convertToNum from "../../utils/gameUtils"
import styles from "./Game.module.css"
import ResultModal from "../Modal/ResultModal";
import Button from "../Button/Button";
import DealRulesModal from "../Modal/DealRulesModal";
import Loader from "../Loader/Loader";
import { FaHandPaper } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";



// BlackjackGame Component
const BlackjackGame: React.FC = () => {
  const [deckId, setDeckId] = useState('');
  const [addPlayersCards, setAddPlayersCards] = useState([]);
  const [addDealersCards, setAddDealersCards] = useState([]);
  const [dealerScore, setDealerScore] = useState(null);
  const [playerScore, setPlayerScore] = useState(null);
  const [result, setResult] = useState('');
  const [dealerFirstCardSrc, setDealerFirstCardSrc] = useState("https://opengameart.org/sites/default/files/card%20back%20red.png");
  const [dealerCardsSum, setDealerCardsSum] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameIsStarting, setGameIsStarting] = useState(true)
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    const getDeck = async () => {
      try {
        const res = await fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2");
        const data = await res.json();
        setDeckId(data.deck_id);
      } catch (err) {
        console.log(err);
      }
    };
    getDeck();
  }, []);

  const getCard = async () => {
    try {
      const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
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
     setDealerFirstCardSrc("https://opengameart.org/sites/default/files/card%20back%20red.png");

    setAddDealersCards(prevCards => [...prevCards, dealerCardOne, dealerCardTwo]);
    setAddPlayersCards(prevCards => [...prevCards, playerCardOne, playerCardTwo]);


    // Calculate and set dealer score (show only second card)
    const dealerSecondCardValue = convertToNum(dealerCardTwo.value);
    setDealerScore(dealerSecondCardValue);


  
    // Calculate and set player score
    const playerCardsSum = sumCards([playerCardOne, playerCardTwo]);
    setPlayerScore(playerCardsSum);

    
  
    // Check for Blackjack
    if (playerCardsSum === 21) {
      flipDealersCard()
      checkForWinner()

    }
    setLoading(false)
  };




  const flipDealersCard = () => {
    if (addDealersCards && addDealersCards.length > 0) {
      const firstCardImage = addDealersCards[0].image;
      console.log("First card image:", firstCardImage);
  
      setDealerFirstCardSrc(firstCardImage);
    
      // Calculate and set sum of dealer's cards
      const dealerCardsSum = sumCards(addDealersCards);
      setDealerScore(dealerCardsSum);
      console.log(dealerCardsSum, 'dealers first two cards sum')
    }
            // Check for Blackjack
            if (dealerCardsSum === 21) {
              checkForWinner()
            }

  };
  
  console.log(dealerScore, 'DEALERS SCORE <=========')
            



  
  console.log(addDealersCards, 'dealers')
  console.log(addPlayersCards, 'players')
  console.log(dealerScore, 'DEALER SCORE')
  console.log(playerScore, 'PLAYER SCORE')





  const hit = async () => {
    const newPlayerCard = await getCard();
    setAddPlayersCards([...addPlayersCards, newPlayerCard]);

    // Calculate and set player score
    const playerCardsSum = sumCards([...addPlayersCards, newPlayerCard]);
    setPlayerScore(playerCardsSum);

    
  
    // Check for Bust
    if (playerCardsSum >= 21) {
      flipDealersCard()
      checkForWinner();
    }
  };



  const stand = async () => {
    // Flip the dealer's first card
    flipDealersCard();
  
    // Recalculate dealer score
    const updatedDealerCards = [...addDealersCards];
    let dealerCardsSum = sumCards(updatedDealerCards);
  
    // If the dealer's score is already 17 or higher, check for winner
    if (dealerCardsSum >= 17) {
      checkForWinner();
    } else {
      // Keep drawing cards for the dealer until their total sum is 17 or higher
      while (dealerCardsSum < 17) {
        const newDealerCard = await getCard();
        updatedDealerCards.push(newDealerCard);
        
        // Calculate the sum of all dealer's cards including the newly drawn card
        dealerCardsSum = sumCards(updatedDealerCards);
        
        // Update the dealer's score
        setAddDealersCards(updatedDealerCards);
        setDealerScore(dealerCardsSum);
      }
  
      // Check for winner after the dealer stops drawing cards
      checkForWinner();
    }
  };
    
  
  

  // SUM CARDS
  //We sort the cards in descending order (b - a). This is important because we want to check for the ace value before any other card value.
  //We iterate over the sorted cards and apply the same logic as before, dynamically choosing the ace value to avoid busting.
  //This way, the ace value is chosen intelligently, just like in your previous JavaScript code.
  function sumCards(cards) {
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

    // if (hasAce && sum === 21) {
    //   return sum;
    // }
  
    return sum;
  }
  
  
  
  useEffect(() => {
    // Call the checkForWinner function when the player's cards state changes
    if (gameEnded) {
      checkForWinner();
    }
  }, [addPlayersCards, addDealersCards, gameEnded]); // Watch for changes in the player's cards state




  function checkForWinner() {
    // Calculate player score
  
    const playerScore = sumCards(addPlayersCards);
  
    // Calculate dealer score
    const dealerScore = sumCards(addDealersCards);
    console.log(playerScore, "final players score");
    console.log(dealerScore, "final dealers score");
  
      if (playerScore === 21 && dealerScore < 21) {
        setGameEnded(true);
        setResult("BLACKJACK PLAYER WINS");
        console.log(result, "result");
      } else if (dealerScore > 21 && playerScore <= 21) {
        setGameEnded(true);
        setResult("PLAYER WINS");
        console.log(result, "result");
      } else if (playerScore > dealerScore && playerScore <= 21) {
        setGameEnded(true);
        setResult("PLAYER WINS");
        console.log(result, "result");
      } else if (dealerScore > playerScore && dealerScore <= 21) {
        setGameEnded(true);
        setResult("DEALER WINS");
        console.log(result, "result");
      } else if (playerScore > 21 && dealerScore <= 21) {
        setGameEnded(true);
        setResult("BUST! DEALER WINS");
        console.log(result, "result");
      } else if (dealerScore === 21 && playerScore < 21) {
        setGameEnded(true);
        setResult("BLACKJACK DEALER WINS");
        console.log(result, "result");
      } else {
        setGameEnded(true);
        setResult("DRAW");
        console.log(result, "result");
      }
  }
  
  
  



  const startGameAgain = () => {
    // Reset any necessary state variables to start a new game
    setAddDealersCards([])
    setAddPlayersCards([])
    setDealerScore(null)
    setPlayerScore(null)
    setResult('')
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
            <div className={styles.score}>{dealerScore}</div>
            <div className={styles.cards_wrapper}>
              {addDealersCards.map((card, index) => (
                <Card
                  key={index}
                  image={index === 0 ? dealerFirstCardSrc : card.image}
                  value={card.value}
                  isDealer={true}
                  isFirst={index === 0}
                  dealerFirstCardSrc={dealerFirstCardSrc} // Pass dealerFirstCardSrc as a prop
                />
              ))}
            </div>
          </div>

          {gameEnded && (
            <ResultModal result={result} startGameAgain={startGameAgain} dealerScore={dealerScore} playerScore={playerScore}/>
          )}

          <div className={styles.container}>
            <div className={styles.cards_wrapper}>
              {addPlayersCards.map((card, index) => (
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

            <div className={styles.score}>{playerScore}</div>
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

            {!gameIsStarting && loading ? (
           null
            ) : (
              <>
              <Button
                className={styles.hit_button}
                onClick={hit}
                icon={<MdPersonAddAlt1/>}
                text="Hit"
                disabled={gameEnded}
              />
              <Button
                className={styles.stand_button}
                onClick={stand}
                text="Stand"
                icon={<FaHandPaper/>}
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