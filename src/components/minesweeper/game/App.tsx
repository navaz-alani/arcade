import { FC, memo, useEffect, useReducer } from "react";
import styles from "./App.module.css";
import { Action, Config } from "./../share/types";
import { MinesweeperGameState } from "./minesweeper";
import Grid from "../grid/Grid";

interface GameState {
  game: MinesweeperGameState;
};

const GameReducer = (s: GameState, a: Action): GameState => {
  let state = { ...s };
  if (a === "reset") state.game.reset();
  else if (a.type === "reset-config")
    return {
      game: new MinesweeperGameState(a.conf.rows, a.conf.cols, a.conf.mines)
    };
  else if (a.type === "flag")  state.game.flag(a.pos);
  else state.game.handleClick(a.pos);
  return state;
}

const MinesweeperGame: FC<Config> = memo(({ rows, cols, mines }) => {
  let [gs, dispatch] = useReducer(GameReducer, {
    game: new MinesweeperGameState(rows, cols, mines),
  });

  useEffect(() => {
    dispatch({
      type: "reset-config",
      conf: { rows: rows, cols: cols, mines: mines },
    });
  // reset game when configuration changes
  }, [rows, cols, mines]);

  return (
    <div className={styles["app"]}>
      <Grid game={gs.game} dispatch={dispatch} />
      { gs.game.isWon() === "loss" && <h2>Oh no, you lost!</h2> }
      { gs.game.isWon() === "win" && <h2>You won!</h2> }
      <p><strong>Note: </strong>Right-click to (un)flag.</p>
      <button className={styles["app-button"]}
              onClick={() => dispatch("reset")}
      >
        Reset Game
      </button>
    </div>
  );
});


export default MinesweeperGame;
