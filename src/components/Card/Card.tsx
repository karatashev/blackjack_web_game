
import styles from "./Card.module.css"
import 'animate.css';


interface CardProps {
  image: string;
  value: string;
  isDealer: boolean;
  isFirst: boolean;
  dealerFirstCardSrc: string;
}

const Card: React.FC<CardProps> = ({ image, value, isDealer, isFirst, dealerFirstCardSrc }) => {
  return (
    <img className={`${styles.card} animate__animated animate__backInRight animate__delay-2s}`} src={isDealer && isFirst ? dealerFirstCardSrc : image} alt={value} />
  );
};




export default Card