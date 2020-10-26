import { FC, useState, useEffect, useRef } from "react";
import styles from "./Bird.module.css";
import { BirdState, BirdColor } from "./../share/types";

interface Props {
  birdColor: BirdColor;
};

const INIT_VEL: number = 150;

// generates the class name based on the state of the bird
const getClassName = (state: BirdState, color: BirdColor): string => {
  let c: string = "bird";
  switch (color) {
    case BirdColor.Red:    { c += "-red"; break }
    case BirdColor.Blue:   { c += "-blue"; break }
    case BirdColor.Yellow: { c += "-yellow"; break }
  }
  switch (state) {
    case BirdState.Downflap: { c += "-downflap"; break }
    case BirdState.Midflap:  { c += "-midflap"; break }
    case BirdState.Upflap:   { c += "-upflap"; break }
  }
  return `${styles["bird"]} ${styles[c]}`;
}

const Bird: FC<Props> = ({ birdColor }) => {
  let [state, setState] = useState<BirdState>(BirdState.Midflap);
  let [height, setHeight] = useState<number>(0);
  let [vel, setVel] = useState<number>(INIT_VEL);
  let [clicked, setClicked] = useState<boolean>(false);
  let birdRef = useRef<HTMLDivElement>(null);

  const clickHanlder = (e: KeyboardEvent) => {
    if (["ArrowUp", " "].includes(e.key)) setClicked(true);
  }

  useEffect(() => {
    const FALL_CONSTANT: number = 250;
    const FREQ: number = 100/1000;
    const interval: NodeJS.Timeout = setInterval(() => {
      let diff: number = (clicked) ? Math.max(-1*vel, -50) : vel;
      setHeight(h => {
        let hNew = (clicked)
          ? (h + diff < 0) ? 0 : h + diff
          : h + diff*FREQ;
        return (hNew > 512) ? 512 : hNew
      });
      if (clicked) { setVel(INIT_VEL); setClicked(c => !c); setState(BirdState.Upflap); }
      else { setVel(v => v + (FALL_CONSTANT*FREQ)); setState(BirdState.Downflap); };
    }, FREQ*1000);
    return () => clearInterval(interval);
  }, [clicked, vel]);

  useEffect(() => {birdRef.current.style.top = `${height}px`}, [height]);
  useEffect(() => {document.addEventListener("keydown", clickHanlder)}, []);

  return (
    <div className={getClassName(state, birdColor)} ref={birdRef}>
    </div>
  );
}

export default Bird;
