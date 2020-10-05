import React from 'react';
import styles from './App.module.css';
import { Grid, GridItem, SnakeGrid } from "@components/snake/grid/Grid";

enum Direction { Up, Down, Left, Right };

const GRID_DIM: number = 20;
const INIT_DIR: Direction = Direction.Up;
const INIT_FREQ: number = 275;
const FREQ_SUB: number = 15;
const SCORE_MAX: number = 50;

interface Pos { x: number, y: number };

interface LossState {
  isLost: boolean;
  message: string;
}

interface GameState {
  loss:   LossState;
  score:  number;
  grid:   Grid;
  snake:  Array<Pos>;
  food:   Array<Pos>;
};

const InitialGameState = (): GameState => {
  return {
    loss: {
      isLost: false,
      message: ""
    },
    score: 0,
    grid: new Array<Array<GridItem>>(GRID_DIM).fill(
      new Array<GridItem>(GRID_DIM).fill("void")
    ),
    snake: new Array<Pos>({x: 10, y: 10}),
    food: new Array<Pos>({
      x: Math.floor((Math.random() * GRID_DIM)),
      y: Math.floor((Math.random() * GRID_DIM)),
    }),
  };
}

const GameReducer = (s: GameState, action: Direction | "reset" ): GameState => {
  if (action === "reset") return InitialGameState();
  // move snake in set direction
  let moveVec: Pos = {x: 0, y: 0};
  switch (action) {
    case Direction.Up: { moveVec = {x: 0, y: -1}; break; }
    case Direction.Down : { moveVec = {x: 0, y: 1}; break; }
    case Direction.Left : { moveVec = {x: -1, y: 0}; break; }
    case Direction.Right : { moveVec = {x: 1, y: 0}; break; }
  }
  // copy state over
  let state = JSON.parse(JSON.stringify(s));
  // move snake in direction
  let tmp: Pos = { ...state.snake[0] };
  let addSnakeBody: boolean = false;
  for (let i: number = 0; i < state.snake.length; ++i) {
    if (i === 0) {
      state.snake[0].x += moveVec.x;
      state.snake[0].y += moveVec.y;
      // check if snake has advanced out of bounds
      const p: Pos = state.snake[0];
      if ( p.x < 0 || p.x >= GRID_DIM || p.y < 0 || p.y >= GRID_DIM ) {
        state.loss = {
          isLost: true,
          message: "Out of bounds!",
        };
      }
      // check if snake has eaten current food item
      if ( state.snake[0].x === state.food[0].x &&
           state.snake[0].y === state.food[0].y ) {
        ++state.score;
        addSnakeBody = true;
      }
      continue;
    }
    let tmp2: Pos = { ...state.snake[i] };
    // check if snake has eaten itself
    if ( tmp2.x === state.snake[0].x && tmp2.y === state.snake[0].y ) {
      state.loss = {
        isLost: true,
        message: "You ate yourself!",
      };
    }
    state.snake[i] = tmp;
    tmp = tmp2;
  }
  if (addSnakeBody) {
    state.snake[state.snake.length] = tmp;
    // add new food item : TODO: make sure food is not produced in snake
    state.food[0].x = Math.floor((Math.random() * GRID_DIM));
    state.food[0].y = Math.floor((Math.random() * GRID_DIM));
  }
  // return early if game has been lost
  if ( state.loss.isLost ) return { ...state };
  // clear grid
  for (let y = 0; y < GRID_DIM; ++y) {
    for (let x = 0; x < GRID_DIM; ++x) {
      state.grid[y][x] = "void";
    }
  }
  // add new snake and food
  state.food.forEach((f: Pos) => {
    state.grid[f.y][f.x] = "food";
  });
  state.snake.forEach((s: Pos) => {
    state.grid[s.y][s.x] = "snake";
  });
  // return new object
  return { ...state };
}

const SnakeGame: React.FC = () => {
  // set up state
  let [gs, dispatch] = React.useReducer(GameReducer, InitialGameState());
  let [direction, setDirection] = React.useState<Direction>( INIT_DIR );
  let [freq, setFreq] = React.useState<number>( INIT_FREQ );

  // keyhoard handler callback
  const keyHandler = React.useCallback(( e: KeyboardEvent ): void => {
    switch ( e.key ) {
      case "ArrowDown": {
        if (direction !== Direction.Up) setDirection( Direction.Down ); break;
      }
      case "ArrowUp": {
        if (direction !== Direction.Down) setDirection( Direction.Up ); break;
      }
      case "ArrowLeft": {
        if (direction !== Direction.Right) setDirection( Direction.Left ); break;
      }
      case "ArrowRight": {
        if (direction !== Direction.Left) setDirection( Direction.Right ); break;
      }
      default:
    }
  }, [direction]);

  // add global hander for keypresses
  React.useEffect(() => {
    document.addEventListener( "keydown", keyHandler );
  }, [keyHandler]);

  // setup game loop
  React.useEffect(() => {
    const gameLoop = setInterval(() => dispatch(direction), freq);
    if (gs.loss.isLost) { clearInterval(gameLoop); }
    return () => clearInterval(gameLoop);
  }, [direction, freq, gs.loss.isLost]);

  // increase speed as game score changes
  React.useEffect(() => {
    if (gs.score < SCORE_MAX) setFreq( (f: number): number => f - FREQ_SUB );
  }, [gs.score]);

  const resetGame = (): void => {
    dispatch("reset");
    setDirection(INIT_DIR);
    setFreq(INIT_FREQ);
  };

  return (
    <div className={styles["app"]}>
    <h1>Snake Game</h1>
    <h2>
      Score: {gs.score}
    </h2>
      {
        gs.loss.isLost
          ? <>
              <h3>No! {gs.loss.message}</h3>
              <button className={styles["app-button"]}
                      onClick={() => resetGame()}
              >
                Restart
              </button>
            </>
          :  <SnakeGrid gridData={gs.grid} />
      }
    </div>
  );
}

export default SnakeGame;
