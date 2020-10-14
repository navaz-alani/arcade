import React from "react";
import { Ball as BallT } from "../share/types";
import styles from "./Ball.module.css";

interface Props {
  ball: BallT;
};

const Ball: React.FC<Props> = ({ ball }) => {
  return <div className={styles["ball"]} ref={ball.ref}></div>
};

export default Ball;
