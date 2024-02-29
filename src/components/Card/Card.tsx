// Card Component



const Card: React.FC<{ image: string; value: string; }> = ({ image, value }) => {
  return (
    <img src={image} alt={`${value}`} />
  );
};

export default Card;