import React from "react";
import styles from "./App.module.css";
import Paddle from "./Paddle";
import Ball from "./Ball";
import {
  GameState,
  Action,
  Side,
  PaddleDir,
  Pos,
  Paddle as PaddleT
} from "../share/types";

const INIT_FREQ: number = 100;

const InitialGameState =
  (refs: React.MutableRefObject<HTMLDivElement>[]): GameState => {
  return {
    turn: Side.Down,
    paddles: [
      { side: Side.Up,   pos: { x: 300, y: 0 }, ref: refs[0] },
      { side: Side.Down, pos: { x: 300, y: 0 }, ref: refs[1] },
    ],
    ball: {
      pos: { x: 0, y: 0 },
      dir: {
        x: Math.floor(Math.random()*20 + 10),
        y: Math.floor(Math.random()*20 + 10),
      },
      ref: refs[2]
    },
    container: refs[3],
    score: [0, 0],
    win: {
      isWon: false,
      winner: null,
    },
  };
}

const GameReducer = (s: GameState, a: Action): GameState => {
  if (a === "reset") return InitialGameState([s.paddles[0].ref, s.paddles[1].ref]);
  const ballRect: DOMRect = s.ball.ref.current.getBoundingClientRect();
  const contWidth: number = s.container.current.clientWidth;
  const contHeight: number = s.container.current.clientHeight;
  if (a === "move-ball") {
    const newPos: Pos = {
      x: s.ball.pos.x + s.ball.dir.x,
      y: s.ball.pos.y + s.ball.dir.y,
    }
    const width: number = s.ball.ref.current.clientWidth;

    // check for collision with the paddles
    for (let i = 0; i < s.paddles.length; ++i) {
      let p: DOMRect = s.paddles[i].ref.current.getBoundingClientRect();
      let absPos: Pos = {
        x: ballRect.x + s.ball.dir.x,
        y: ballRect.y + s.ball.dir.y,
      };
      // check for collision
      if (p.x - width <= absPos.x && absPos.x <= p.x + p.width &&
          p.y <= absPos.y && absPos.y <= p.y - p.height) {
        // set new velocity
        s.ball.dir.x = -(s.ball.dir.y/20) * (p.x- ballRect.x)
        s.ball.dir.y *= -1;
        // set new transform
        s.ball.pos.x = newPos.x;
        s.ball.pos.y = (i === 0) ? p.height : contHeight - width;
        s.ball.ref.current.style.transform =
          `translate(${s.ball.pos.x}px, ${s.ball.pos.y}px)`;
        s.turn = (s.turn === Side.Down) ? Side.Up : Side.Down;
        return { ...s };
      }
    }

    // left wall
    if (newPos.x < 0) { newPos.x = 0; s.ball.dir.x *= -1; }
    // right wall
    if (newPos.x + width > contWidth) {
      newPos.x = contWidth - width; s.ball.dir.x *= -1;
    }
    let point: { side: Side, rallyEnd: boolean } = { side: null, rallyEnd: false };
    // top wall
    if (newPos.y < 0) {
      newPos.y = 0; s.ball.dir.y *= -1;
      point.side = Side.Down; point.rallyEnd = true;
    }
    // bottom wall
    if (newPos.y + width > contHeight){
      newPos.y = contHeight - width; s.ball.dir.y *= -1;
      point.side = Side.Up; point.rallyEnd = true;
    }

    s.ball.pos.x = newPos.x; s.ball.pos.y = newPos.y;
    s.ball.ref.current.style.transform =
      `translate(${s.ball.pos.x}px, ${s.ball.pos.y}px)`;
    if (point.rallyEnd) {
      ++s.score[point.side];
      s.ball.pos.x = 300; s.ball.pos.y = 300;
      s.ball.ref.current.style.transform =
        `translate(${s.ball.pos.x}px, ${s.ball.pos.y}px)`;
      s.ball.dir = {
        x: Math.floor(Math.random()*20 - 10),
        y: Math.floor(Math.random()*20 + 10),
      }
      s.turn = Side.Down;
    }
    return { ...s };
  }

  // move current player's paddle
  const shift: number = 35 * ((a.direction === PaddleDir.Left) ? -1 : 1);
  let paddle: PaddleT = s.paddles[s.turn];
  const width: number = paddle.ref.current.clientWidth;
  if (paddle.pos.x + shift < 0) paddle.pos.x = 0;
  else if (paddle.pos.x + shift + width > contWidth) paddle.pos.x = contWidth - width;
  else paddle.pos.x += shift;
  let pos: Pos  = s.paddles[s.turn].pos;
  s.paddles[s.turn].ref.current.style.transform = `translate(${pos.x}px, 0px)`;

  return { ...s };
};

const PongGame: React.FC = () => {
  let appContainer: React.MutableRefObject<HTMLDivElement> =
    React.useRef<HTMLDivElement>(null);
  let [gs, dispatch] = React.useReducer(GameReducer, InitialGameState([
    React.useRef<HTMLDivElement>(null), // paddle up ref
    React.useRef<HTMLDivElement>(null), // paddle down ref
    React.useRef<HTMLDivElement>(null), // ball ref
    appContainer,
  ]));

  const keyHandler = React.useCallback(( e: KeyboardEvent ): void => {
    switch ( e.key ) {
      case "ArrowLeft": {
        dispatch({ type: "move-paddle", direction: PaddleDir.Left });
        break;
      }
      case "ArrowRight": {
        dispatch({ type: "move-paddle", direction: PaddleDir.Right });
        break;
      }
    }
  }, []);

  React.useEffect(() => {
    // add global hander for keypresses
    document.addEventListener( "keydown", keyHandler );
  // move the ball
    const gameLoop = setInterval(() => dispatch("move-ball"), INIT_FREQ);
    return () => clearInterval(gameLoop);
  }, [keyHandler]);

  return (
    <div className={styles["app-container"]}>
    <p>{gs.score[0]}</p>
    <div className={styles["app"]} ref={appContainer}>
      <Paddle paddle={gs.paddles[0]} />
      <Ball   ball={gs.ball} />
      <Paddle paddle={gs.paddles[1]} />
    </div>
    <p>{gs.score[1]}</p>
    </div>

  );
}

export default PongGame;
