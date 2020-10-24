import { FC, useReducer } from "react";
import styles from "./App.module.css";
import { Action } from "./../share/types";
import { MinesweeperGameState } from "./minesweeper";
import Grid from "../grid/Grid";

interface GameState {
  game: MinesweeperGameState;
};

const GameReducer = (s: GameState, action: Action): GameState => {
  let state = { ...s };
  if      (action === "reset") state.game.reset();
  else if (action.type === "flag")  state.game.flag(action.pos);
  else                              state.game.handleClick(action.pos);
  return state;
}

const InitialGameState =  (rows: number, cols: number, mines: number): GameState => {
  return {
    game: new MinesweeperGameState(rows, cols, mines),
  };
}

interface Props {
  rows: number;
  cols: number;
  mines: number;
};

const MinesweeperGame: FC<Props> = ({ rows, cols, mines }) => {
  let [gs, dispatch] = useReducer(GameReducer, InitialGameState(rows, cols, mines));
  return (
    <div className={styles["app"]}>
      <h1>Minesweeper</h1>
      <Grid game={gs.game} dispatch={dispatch} />
      { gs.game.isWon() === "loss" && <h2>Oh no, you lost!</h2> }
      { gs.game.isWon() === "win" && <h2>You won!</h2> }
      <button className={styles["app-button"]}
              onClick={() => dispatch("reset")}
      >
        Reset Game
      </button>
      <p><strong>Note: </strong>Right-click to (un)flag.</p>
    </div>
  );
}


export default MinesweeperGame;
