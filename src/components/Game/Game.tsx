import { useEffect, useState } from "react";
import Card from "../Card/Card";
import convertToNum from "../../utils/convertValues"

// BlackjackGame Component
const BlackjackGame: React.FC = () => {
  const [deckId, setDeckId] = useState('');
  const [addPlayersCards, setAddPlayersCards] = useState([]);
  const [addDealersCards, setAddDealersCards] = useState([]);
  const [sumPlayersCards, setSumPlayersCards] = useState(0);
  const [sumDealersCards, setSumDealersCards] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [result, setResult] = useState('');
  const [dealerFirstCardSrc, setDealerFirstCardSrc] = useState("https://opengameart.org/sites/default/files/card%20back%20red.png");
  const [dealerSecondCardSum, setDealerSecondCardSum] = useState(0);
  const [dealerCardsSum, setDealerCardsSum] = useState(0);



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
      setResult("BLACKJACK PLAYER WINS");
      flipDealersCard()

    }
  };




  const flipDealersCard = () => {
    if (addDealersCards && addDealersCards.length > 0) {
      const firstCardImage = addDealersCards[0].image;
      console.log("First card image:", firstCardImage);
  
      setDealerFirstCardSrc(firstCardImage);
    
      // Calculate and set sum of dealer's cards
      const dealerCardsSum = sumCards(addDealersCards);
      setDealerScore(dealerCardsSum);
    }
            // Check for Blackjack
            if (dealerCardsSum === 21) {
              setResult("BLACKJACK DEALER WINS");
            }

  };
  
            



  
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
      checkForWinner();
      flipDealersCard()
    }
  };

  const stand = async () => {
    // Flip the dealer's first card
    flipDealersCard();
  
    // Draw a new card for the dealer
    const newDealerCard = await getCard();
    setAddDealersCards(prevCards => [...prevCards, newDealerCard]);
  
    // Calculate the sum of all dealer's cards including the newly drawn card
    const updatedDealerCards = [...addDealersCards, newDealerCard];
    const dealerCardsSum = sumCards(updatedDealerCards);
  
    // Update the dealer's score
    setDealerScore(dealerCardsSum);
  
    console.log(dealerCardsSum, "dealers score in stand");
  
    // Check for winner
    if (dealerCardsSum < 17) {
      stand(); // Draw another card if the dealer's score is less than 17
    } else {
      checkForWinner(); // Check for winner if the dealer's score is 17 or higher
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
  
  
  
  


  function checkForWinner() {

      // Calculate player score
  const playerScore = sumCards(addPlayersCards);
  
  // Calculate dealer score
  const dealerScore = sumCards(addDealersCards);
  console.log(playerScore, 'final players score')
  console.log(dealerScore, 'final dealers score')

    if (playerScore > dealerScore && playerScore <= 21) {
      setResult("PLAYER WINS");
      console.log(result, 'result');

    } else if (dealerScore > 21 && playerScore <= 21) {
      setResult("PLAYER WINS");
      console.log(result, 'result');
    } else if (playerScore === 21 && dealerScore < 21) {
      setResult("BLACKJACK PLAYER WINS");
      console.log(result, 'result');
    } else if (dealerScore > playerScore && dealerScore <= 21) {
      setResult("DEALER WINS");
      console.log(result, 'result');
    } else if (playerScore > 21 && dealerScore <= 21) {
      setResult("BUST! DEALER WINS");
      console.log(result, 'result');
    } else if (dealerScore === 21 && playerScore < 21) {
      setResult("BLACKJACK DEALER WINS");
      console.log(result, 'result');
    } else {
      setResult("DRAW");
      console.log(result, 'result');
    }
  }
  
  
  useEffect(() => {
    // Call the checkForWinner function when the player's cards state changes
    checkForWinner();
  }, [addPlayersCards, addDealersCards]); // Watch for changes in the player's cards state




  return (
    <div className="blackjack-game">
      {/* Render cards */}
      <div className="dealer-cards">
      {
    addDealersCards.map((card, index) => (
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
      <div className="player-cards">
        {addPlayersCards.map((card, index) => (
          <Card
            key={index}
            image={card.image}
            value={card.value}
            isDealer={false}
            isFirst={index === 0}
          />
        ))}
      </div>

      {/* Render buttons */}
      <button onClick={dealCards}>Deal</button>
      <button onClick={hit}>Hit</button>
      <button onClick={stand}>Stand</button>

      {/* Render scores and result */}
      <div className="dealer-score">Dealer Score: {dealerScore}</div>
      <div className="player-score">Player Score: {playerScore}</div>
      <div className="result">{result}</div>
    </div>
  );
};

export default BlackjackGame;