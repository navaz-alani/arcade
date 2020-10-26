import { FC } from "react";
import {BirdColor} from "../share/types";
import styles from "./App.module.css";
import Bird from "./Bird";

const FlappyBirdGame: FC = () => {
  return (
    <div className={styles["app"]}>
      <Bird birdColor={BirdColor.Red} />
    </div>
  );
};

export default FlappyBirdGame;
