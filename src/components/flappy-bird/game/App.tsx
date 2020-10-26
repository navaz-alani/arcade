import { FC, useState } from "react";
import { BirdColor } from "../share/types";
import styles from "./App.module.css";
import Bird from "./Bird";
import ColorPicker from "./ColorPicker";

const FlappyBirdGame: FC = () => {
  let [color, setColor] = useState<BirdColor>(BirdColor.Red);

  return (
    <div className={styles["app"]}>
    <ColorPicker color={color} setColor={setColor} />
    <div className={styles["world"]}>
      <Bird birdColor={color} />
    </div>
    </div>
  );
};

export default FlappyBirdGame;
