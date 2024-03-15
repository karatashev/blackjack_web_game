import { Dispatch, SetStateAction } from 'react'; // Import Dispatch and SetStateAction types


export type CardFace = {
  value: string;
  face: string;
  image: string;
};

export type CheckForWinnerProps = {
  addPlayersCards: CardFace[];
  addDealersCards: CardFace[];
  setGameEnded: Dispatch<SetStateAction<boolean>>;
  setResult: Dispatch<SetStateAction<string>>;
  sumCards: (cards: CardFace[]) => number;
};