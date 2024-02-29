//DOM
let deckId = ""; //we store our deck in global variable
let sumPlayersCards;
let sumDealersCards;

//first card for the dealer
let dealerCardOne = document.querySelector(".dealer-card1");

let result = document.querySelector(".result");

const dealerCards = document.querySelector(".dealer-cards");
const playerCards = document.querySelector(".player-cards");

const dealerScore = document.querySelector(".dealer-score");
const playerScore = document.querySelector(".player-score");

//Buttons
const dealButton = document.querySelector(".deal");
const hitButton = document.querySelector(".hit");
const standButton = document.querySelector(".stand");

//we store value from the cards here
let addPlayersCards = [];
let addDealersCards = [];

//Event listeners
dealButton.addEventListener("click", dealCards);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);

async function getDeck() {
  try {
    let res = await fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2");
    let data = await res.json()
    console.log(data);
    deckId = data.deck_id;
  } catch (err) {
    console.log(err)
  }
};
getDeck();

async function dealCards() {

  addDealersCards.push(await getCard());
  addPlayersCards.push(await getCard());
  addDealersCards.push(await getCard());
  addPlayersCards.push(await getCard());

  // dealerScore.textContent = convertToNum(addDealersCards[1].cards[0].value);

  dealButton.classList.toggle("hide");
  hitButton.classList.toggle("hide");
  standButton.classList.toggle("hide");
  dealerScore.classList.toggle("hide");
  playerScore.classList.toggle("hide");

  console.log(addPlayersCards)
  console.log(addDealersCards)

  renderCards();
  sumCards();
  if (sumPlayersCards === 21) {
    result.innerText = "BLACKJACK PLAYER WINS";
    flipDealersFirstCard();
    checkForWinner();
  }
}

async function hit() {
  addPlayersCards.push(await getCard());
  sumCards();
  renderPlayersCard();
  console.log(addPlayersCards)

  //If player goes over 21 to finish the game and open the dealers cards
  if (sumPlayersCards >= 21) {
    flipDealersFirstCard();
    checkForWinner(); 
  }
}

async function stand() {
  flipDealersFirstCard();

  //To hit the Dealer till he's over 17 or over
  while (sumDealersCards < 17) {
    addDealersCards.push(await getCard());
    sumCards();
    renderDealersCard();
  }

  // sumCards()
  checkForWinner();
}

//Deal one card
async function getCard() {
  try {
    let res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    let data = await res.json()
    console.log(data)
    return data.cards[0];

  } catch (err) {
    console.log(err)
  }
};

function sumCards() {

  sumPlayersCards = addPlayersCards
  .map(card => card.value)
  .sort()
  .reduce((sum, current) => {
    const currVal = convertToNum(current);
    const preSum = sum + currVal;
    console.log(preSum)
    if (currVal === 11 && preSum > 21) {
      return preSum - 10;
    }
    console.log(preSum)


    return preSum;
  }, 0);

  console.log(addPlayersCards)


  sumDealersCards = addDealersCards
  .map(card => card.value)
  .sort()
  .reduce((sum, current) => {
    const currVal = convertToNum(current);
    const preSum = sum + currVal;
    console.log(preSum);

    if (currVal === 11 && preSum > 21) {
      return preSum - 10;
    }

    console.log(preSum)
    return preSum;
    
  }, 0);
  console.log(addDealersCards)

  dealerScore.textContent = convertToNum(addDealersCards[addDealersCards.length - 1].value);
  playerScore.textContent = sumPlayersCards;


  console.log(sumDealersCards)
  console.log(sumPlayersCards)
}

//Render the cards from the arrays
function renderCards() {
  addDealersCards.forEach(element => {
    let cardElement = document.createElement("img");
    dealerCards.appendChild(cardElement);
    cardElement.src = element.image;
    dealerCards.firstElementChild.src = "https://opengameart.org/sites/default/files/card%20back%20red.png";
  })

  addPlayersCards.forEach(element => {
    let cardElement = document.createElement("img");
    playerCards.appendChild(cardElement);
    cardElement.src = element.image;
  })
}

function renderPlayersCard() {
  let cardElement = document.createElement("img");
  playerCards.appendChild(cardElement);
  cardElement.src = addPlayersCards[addPlayersCards.length - 1].image;
  // playerScore.textContent = sumCards();
}

function renderDealersCard() {
  let cardElement = document.createElement("img");
  dealerCards.appendChild(cardElement);
  cardElement.src = addDealersCards[addDealersCards.length - 1].image;
  dealerScore.textContent = sumDealersCards;
}

//To flip the first card for the dealer and sum dealers cards.
function flipDealersFirstCard() {
  dealerCards.firstElementChild.src = addDealersCards[0].image;
  dealerScore.textContent = sumDealersCards;
}

//To convert the cards with string Values
function convertToNum(val) {
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

//Checks who won
function checkForWinner() {
  if (sumPlayersCards > sumDealersCards && sumPlayersCards < 21) {
    result.classList.toggle("hide");
    result.innerText = "PLAYER WINS";
  } else if (sumDealersCards > 21 && sumPlayersCards <= 20) {
    result.classList.toggle("hide");
    result.innerText = "PLAYER WINS";
  } else if (sumPlayersCards === 21 && sumDealersCards <= 20) {
    result.classList.toggle("hide");
    result.innerText = "BLACKJACK PLAYER WINS";
  } else if (sumDealersCards > sumPlayersCards && sumDealersCards < 21) {
    result.classList.toggle("hide");
    result.innerText = "DEALER WINS";
  } else if (sumPlayersCards > 21 && sumDealersCards <= 20) {
    result.classList.toggle("hide");
    result.innerText = "BUST! DEALER WINS";
  } else if (
    (sumDealersCards === 21 && sumPlayersCards <= 20) ||
    sumPlayersCards > 21
  ) {
    result.classList.toggle("hide");
    result.innerText = "BLACKJACK DEALER WINS";
  } else {
    result.classList.toggle("hide");
    result.innerText = "DRAW";
  }
}