import { FC, memo, useState, useEffect, useRef } from "react";
import styles from "./Bird.module.css";
import { BirdState, BirdColor } from "./../share/types";

const INIT_VEL: number = 150;
const FALL_CONSTANT: number = 250;
const FREQ: number = 100/1000;

// generates the class name based on the state of the bird
const getClassName = (state: BirdState, color: BirdColor): string => {
  let c: string = "bird";
  if      (color == BirdColor.Red)    c += "-red";
  else if (color == BirdColor.Blue)   c += "-blue";
  else if (color == BirdColor.Yellow) c += "-yellow";
  else c += "-red"; // default, in case of error
  switch (state) {
    case BirdState.Downflap: { c += "-downflap"; break }
    case BirdState.Midflap:  { c += "-midflap"; break }
    case BirdState.Upflap:   { c += "-upflap"; break }
  }
  return `${styles["bird"]} ${styles[c]}`;
}

interface Props {
  birdColor: BirdColor;
};

const Bird: FC<Props> = memo(({ birdColor }) => {
  let [state, setState] = useState<BirdState>(BirdState.Midflap);
  let [height, setHeight] = useState<number>(0);
  let [vel, setVel] = useState<number>(INIT_VEL);
  let [clicked, setClicked] = useState<boolean>(false);
  let birdRef = useRef<HTMLDivElement>(null);
  let [className, setClassName] = useState<string>(getClassName(state, birdColor));

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      let diff: number = (clicked) ? Math.max(-1*vel, -50) : vel;
      setHeight(h => {
        let hNew = (clicked)
          ? (h + diff < 0) ? 0 : h + diff
          : h + diff*FREQ;
        return (hNew > 512) ? 512 : hNew
      });
      if (clicked) {
        setVel(INIT_VEL);
        setClicked(c => !c);
        setState(BirdState.Downflap);
        new Audio("/flappy_bird_assets/audio/wing.ogg").play();
      }
      else { setVel(v => v + (FALL_CONSTANT*FREQ)); setState(BirdState.Upflap); };
    }, FREQ*1000);
    return () => clearInterval(interval);
  }, [clicked, vel]);

  useEffect(() => {birdRef.current.style.top = `${height}px`}, [height]);
  useEffect(() => setClassName(getClassName(state, birdColor)), [birdColor, state]);
  useEffect(() => {document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (["ArrowUp", " "].includes(e.key)) setClicked(true);
  })}, []);

  return (
    <div className={className} ref={birdRef}>
    </div>
  );
});

export default Bird;
