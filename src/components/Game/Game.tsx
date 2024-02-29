import { useEffect, useState } from "react";
import Card from "../Card/Card";

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
    const dealerCardOne = await getCard();
    const dealerCardTwo = await getCard();
    const playerCardOne = await getCard();
    const playerCardTwo = await getCard();
  

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
    }
  };

  //To convert the cards with string Values
function convertToNum(val: string) {
  if (val === "ACE") {
    return 11;
  } 
  else if (val === "KING" || val === "QUEEN" || val === "JACK") {
    return 10;
  } 
  else {
    return Number(val);
  }
}

  
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
      // flipDealersFirstCard();
      checkForWinner(); 
    }
  };

  const stand = async () => { 
    // Logic for dealer's turn
    // Calculate and set dealer score
    // Check for winner
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
  
    return sum;
  }
  
  
  
  
  


// function checkForWinner() {
//   if (sumPlayersCards > sumDealersCards && sumPlayersCards < 21) {
//     result.classList.toggle("hide");
//     result.innerText = "PLAYER WINS";
//   } else if (sumDealersCards > 21 && sumPlayersCards <= 20) {
//     result.classList.toggle("hide");
//     result.innerText = "PLAYER WINS";
//   } else if (sumPlayersCards === 21 && sumDealersCards <= 20) {
//     result.classList.toggle("hide");
//     result.innerText = "BLACKJACK PLAYER WINS";
//   } else if (sumDealersCards > sumPlayersCards && sumDealersCards < 21) {
//     result.classList.toggle("hide");
//     result.innerText = "DEALER WINS";
//   } else if (sumPlayersCards > 21 && sumDealersCards <= 20) {
//     result.classList.toggle("hide");
//     result.innerText = "BUST! DEALER WINS";
//   } else if (
//     (sumDealersCards === 21 && sumPlayersCards <= 20) ||
//     sumPlayersCards > 21
//   ) {
//     result.classList.toggle("hide");
//     result.innerText = "BLACKJACK DEALER WINS";
//   } else {
//     result.classList.toggle("hide");
//     result.innerText = "DRAW";
//   }
// }

  return (
    <div className="blackjack-game">
      {/* Render cards */}
      <div className="dealer-cards">
        {addDealersCards.map((card, index) => (
          <Card key={index} image={card.image} value={card.value} />
        ))}
      </div>
      <div className="player-cards">
        {addPlayersCards.map((card, index) => (
          <Card key={index} image={card.image} value={card.value} />
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