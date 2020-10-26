import { FC } from "react";
import { BirdColor } from "../share/types";
import styles from "./ColorPicker.module.css";

interface Props {
  color: BirdColor;
  setColor: (c: BirdColor) => void
};

const ColorPicker: FC<Props> = ({ color, setColor }) => {
  return (
    <div className={styles["color-picker"]}>
      <p>Bird Color:</p>
      <select value={color} onChange={e => {
        setColor(e.target.value as unknown as number as BirdColor)}
      }>
        {
          [BirdColor.Red,BirdColor.Blue,BirdColor.Yellow]
          .map((c: BirdColor, i: number) => {
            return (
              <option key={i}
                      value={c}
              >
                {BirdColor[c]}
              </option>
            );
          })
        }
      </select>
    </div>
  );
};

export default ColorPicker;
