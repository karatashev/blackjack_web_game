 
 export interface Action {
  type: string; // Action type should be one of the defined action types
  payload: any; // Payload can be any value, adjust the type as needed
}
 
 export const SET_DECK_ID = "SET_DECK_ID";
 export const ADD_PLAYERS_CARDS = "ADD_PLAYERS_CARDS";
 export const ADD_DEALERS_CARDS = "ADD_DEALERS_CARDS";
 export const SET_DEALER_SCORE = "SET_DEALER_SCORE";
 export const SET_PLAYER_SCORE = "SET_PLAYER_SCORE";
 export const SET_RESULT = "SET_RESULT";
 export const SET_DEALER_FIRST_CARD_SRC = "SET_DEALER_FIRST_CARD_SRC";
 export const SET_GAME_ENDED = "SET_GAME_ENDED";
 export const SET_GAME_IS_STARTING = "SET_GAME_IS_STARTING";
 export const SET_LOADING = "SET_LOADING";