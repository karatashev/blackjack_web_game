import Lottie from 'lottie-react';
import loaderAnimation from '../../../public/cards_animation_loader.json';
import styles from "./Loader.module.css"

const Loader = () => {
  return (
    <div className={styles.loader_overlay}>
      <div className={styles.loader_container}>
        <Lottie animationData={loaderAnimation} />
      </div>
    </div>
  );
};

export default Loader;
