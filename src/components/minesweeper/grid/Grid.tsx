import { FC } from "react";
import styles from "./Grid.module.css";
import { MinesweeperGameState } from "../game/minesweeper";
import { GridItem, Action, CellState } from "../share/types";

interface Props {
  game: MinesweeperGameState;
  dispatch: (a: Action) => void
};

const getItemClassName = (g: GridItem): string => {
  let c: string = `${styles["grid-item"]}`;
  if (g.state === CellState.Covered || g.state === CellState.Flag)
    c += ` ${styles["covered"]}`
  else if (g.state === CellState.Uncovered)
    c += ` ${styles["uncovered"]}`;
  return c;
}

const getItemContent = (g: GridItem): string => {
  if (g.state === CellState.Uncovered) {
    if (g.surrounding == -1) return "💣";
    else return g.surrounding.toString()
  } else if (g.state === CellState.Flag) {
    return "🚩";
  }
  return "";
}

const Grid: FC<Props> = ({ game, dispatch }) => {
  return (
    <div className={styles["grid"]}>
    {
      game.getGrid().map((row: GridItem[], r: number) => {
        return (
          <div key={r} className={styles["grid-row"]}>
          {
            row.map((item: GridItem, c: number) => {
              return (
                <div key={c}
                     className={getItemClassName(item)}
                     onClick={() => {
                       game.isWon() === "undetermined" &&
                       dispatch({type: "click", pos: { row: r, col: c }});
                     }}
                     onContextMenu={(e) => {
                       game.isWon() === "undetermined" &&
                       item.enabled && dispatch({type: "flag", pos: { row: r, col: c }});
                       e.preventDefault();
                     }}
                >
                {getItemContent(item)}
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

export default Grid;
