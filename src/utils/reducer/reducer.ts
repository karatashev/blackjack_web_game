import { SET_DECK_ID, ADD_PLAYERS_CARDS, ADD_DEALERS_CARDS, SET_DEALER_SCORE, SET_PLAYER_SCORE, SET_RESULT, SET_DEALER_FIRST_CARD_SRC, SET_GAME_ENDED, SET_GAME_IS_STARTING, SET_LOADING, Action } from "./ActionTypes";


export const initialState = {
  deckId: "",
  addPlayersCards: [],
  addDealersCards: [],
  dealerScore: 0,
  playerScore: 0,
  result: "",
  dealerFirstCardSrc: "https://opengameart.org/sites/default/files/card%20back%20red.png",
  gameEnded: false,
  gameIsStarting: true,
  loading: false,
};



const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_DECK_ID:
      return { ...state, deckId: action.payload };
    case ADD_PLAYERS_CARDS:
      return { ...state, addPlayersCards: action.payload };
    case ADD_DEALERS_CARDS:
      return { ...state, addDealersCards: action.payload };
    case SET_DEALER_SCORE:
      return { ...state, dealerScore: action.payload };
    case SET_PLAYER_SCORE:
      return { ...state, playerScore: action.payload };
    case SET_RESULT:
      return { ...state, result: action.payload };
    case SET_DEALER_FIRST_CARD_SRC:
      return { ...state, dealerFirstCardSrc: action.payload };
    case SET_GAME_ENDED:
      return { ...state, gameEnded: action.payload };
    case SET_GAME_IS_STARTING:
      return { ...state, gameIsStarting: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export default reducer