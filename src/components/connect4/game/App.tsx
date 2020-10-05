import React from "react";
import styles from "./App.module.css";
import { Connect4Grid } from "@components/connect4/grid/Grid";
import { Grid, GridItem, GameState, Action, Player } from "components/connect4/share/types";

const GRID_X: number = 7;
const GRID_Y: number = 6;

const InitialGameState = (): GameState => {
  return {
    win: {
      isWon: false,
      message: "",
    },
    error: {
      isError: false,
      message: "",
    },
    grid: new Array(GRID_X).fill(new Array(GRID_Y).fill("void")),
    turn: "red",
  };
}

interface Play {
  row: number;
  col: number;
};

interface DirVec {
  x: number;
  y: number;
};

const DIRECTIONS: DirVec[] = new Array(
  { x: 0, y: -1 },  // UP
  { x: 0, y: 1 },   // DOWN
  { x:-1, y: 0 },   // LEFT
  { x: 1, y: 0 },   // RIGHT
  { x: -1, y: -1 }, // DIAG_UP_LEFT
  { x: 1, y: 1 },   // DIAG_DOWN_RIGHT
  { x: 1, y: -1 },  // DIAG_UP_RIGHT
  { x: -1, y: 1 },  // DIAG_DOWN_LEFT
);

const CHECK_DEPTH: number = 4;

// algorithm to check for winner - check done after every play to see if it was
// a winning play
const checkWinner = (g: Grid, p: Play): Player | null => {
  // color is which player is playing
  let color: GridItem = g[p.col][p.row];
  if ( color === "void" ) return null;
  // check in surrounding directions, in pairs, from most recent play
  for (let d = 0; d < DIRECTIONS.length; d+=2) {
    let dirs: DirVec[] = new Array(DIRECTIONS[d], DIRECTIONS[d+1]);
    let counts: number[] = new Array(0, 0);
    for (let j = 0; j < 2; ++j) {
      for (let i = 1; i < CHECK_DEPTH; ++i) {
        let pt: DirVec = { x: p.col + dirs[j].x*i, y: p.row + dirs[j].y*i };
        if ( 0 > pt.x || pt.x >= GRID_X ||
             0 > pt.y || pt.y >= GRID_Y ||
             g[pt.x][pt.y] === "void") break;
          else if ( g[pt.x][pt.y] == g[p.col][p.row] ) ++counts[j];
      }
    }
    if (  counts[0] + counts[1] >= 3 ) return color;
  }
  return null;
}

type ReducerAction = Action | "reset" | "clear";
const GameReducer = (s: GameState, action: ReducerAction ): GameState => {
  let state = JSON.parse(JSON.stringify(s));
  if (action === "clear") {
    return { ...state, error: { isError: false, message: "" } };
  } else if (action === "reset") {
    return InitialGameState();
  }
  // do not process any more game state changes - game has been won
  if (state.win.isWon) return state;
  // clear any previous error
  state["error"] = { isError: false, message: "" };
  // play the turn
  let played: Play = {col: -1, row: -1};
  for (let i: number = 0; i < state.grid[action.column].length; ++i) {
    if (state.grid[action.column][i] === "void") {
      state.grid[action.column][i] = action.turn;
      played = { col: action.column, row: i };
      break;
    }
  }
  // set error if invalid turn played
  if (played.col == -1) {
    return { ...state, error: {
      isError: true,
      message: "Column full!",
    }};
  }
  // check for winner
  let winner: Player | null = checkWinner(state.grid, played);
  if (winner != null) {
    let message: string;
    switch (winner) {
      case "red": { message = "Red wins!"; break }
      case "yellow": { message = "Yellow wins!"; break; }
    }
    state.win = {
      isWon: true,
      message: message,
    };
  }
  return { ...state, turn: (state.turn === "red") ? "yellow" : "red" };
}

const Connect4Game: React.FC = () => {
  let [gs, dispatch] = React.useReducer(GameReducer, InitialGameState());
  let [turn, setTurn] = React.useState<Player>(gs.turn);

  React.useEffect(() => {
    setTurn(gs.turn);
  }, [gs.turn]);

  return (
    <div className={styles["app"]}>
      <h1>Connect 4</h1>
      {
        !gs.win.isWon
        ?
          <>
            <h3>{(turn === "red") ? "Red's" : "Yellow's"} turn</h3>
            <p className={styles["error-txt"]}>
              {
                gs.error.isError
                  ? `Error: ${gs.error.message}`
                  : gs.error.message
              }
            </p>
            <Connect4Grid turn={turn} grid={gs.grid} dispatch={dispatch} />
          </>
        :
          <div>
            {gs.win.message}
            <Connect4Grid turn={turn} grid={gs.grid} dispatch={dispatch} />
            <button className={styles["app-button"]}
                    onClick={() => dispatch("reset")}
            >
              Restart
            </button>
          </div>
      }
    </div>
  );
}

export default Connect4Game;
