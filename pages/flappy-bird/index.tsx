import { FC } from "react";
import styles from "./index.module.css";
import FlappyBirdGame from "@components/flappy-bird/game/App";

const FlappyBird: FC = () => {
  return (
    <div className={styles["app"]}>
      <h1>Flappy Bird</h1>
      <p>Play with up-arrow or spacebar</p>
      <FlappyBirdGame />
    </div>
  );
}

export default FlappyBird;
