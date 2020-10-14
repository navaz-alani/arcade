# arcade

## About

This project is a collection of games implemented in React + TS. It was an
opportunity for me to learn Typescript and improve my skills in modern React
(function components & hooks). Currently, the following have been completed,
along with their paths (when served with the development server).

* Snake (`/snake`)
* Connect4 (`/connect4`)
* Chess (`/chess`)
* Pong (`/pong`)

## Getting Started

To play these games, clone the repo and execute the following commands:

* `yarn install` to install dependencies.
* `yarn dev` to run the local development server. Once the server has been
  launched, the above paths to the games can be used to access them.

While the above server is managed by NextJS and serves all of the games, the
games themselves are all self-contained. Each game's source code can be found in
`src/components/<game>` where `<game>` is the game's name.
