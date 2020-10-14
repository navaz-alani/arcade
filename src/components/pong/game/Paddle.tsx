import React from "react";
import styles from "./Paddle.module.css";
import { Paddle as PaddleProp, Side } from "../share/types";

interface Props {
  paddle: PaddleProp,
};

const Paddle: React.FC<Props> = ({ paddle }) => {
  return (
    <div className={`${styles["paddle"]} ${styles[Side[paddle.side]]}`}
         ref={paddle.ref}
    >
    </div>
  );
}

export default Paddle;
