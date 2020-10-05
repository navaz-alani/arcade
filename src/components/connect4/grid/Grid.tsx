import React from "react";
import styles from "./Grid.module.css";
import { Player, Grid, GridItem, Action } from "@components/connect4/share/types";

interface Props {
  grid: Grid;
  turn: Player;
  dispatch: React.Dispatch<Action>;
}

export const Connect4Grid: React.FC<Props> = ({ grid, turn, dispatch }) => {
  return (
    <div className={styles["connect4-grid"]}>
      {
        grid.map((col: Array<GridItem>, c: number) => {
          return (
            <div key={c}
                 className={styles["grid-column"]}
                 onClick={() => {
                   dispatch({ turn: turn, column: c });
                 }}
            >
            {
              col.map((item: GridItem, r: number) => {
                return (
                  <div key={`${c}-${r}`}
                       className={`${styles["slide-out"]} ${styles["grid-item"]} ${styles[`grid-item-${item}`]}`}
                  >
                  </div>
                );
              })
            }
            </div>
          );
        })
      }
    </div>
  );
};
