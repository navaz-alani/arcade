import React from "react";
import styles from "./Grid.module.css";

export type GridItem = "food" | "snake" | "void";
export type Grid = Array<Array<GridItem>>;

interface Props {
  gridData: Grid;
};

export const SnakeGrid: React.FC<Props> = ({ gridData }) => {
  return (
      <div className={styles["snake-grid"]}>
      {
        gridData.map((row: Array<GridItem>) => {
          return <div className={styles["grid-row"]}>
          {
            row.map((item: GridItem) => {
              return <div className={`${styles["grid-item"]} ${styles[`grid-item-${item}`]}`}>
              </div>
            })
          }
          </div>
        })
      }
      </div>
  );
}
