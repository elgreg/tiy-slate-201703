'use strict';

let TicTacToeGame = require('./src/tic-tac-toe-game.js');
let fs = require('fs');
let BBPromise = require('bluebird');
let writeFile = BBPromise.promisify(fs.writeFile);

let mkdir = (path) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if(err && err.code !== 'EEXIST'){
        return reject(err);
      }
      resolve();
    })
  });
}


let makeANewGame = () => {

  let game = new TicTacToeGame({humanFirst = Math.random() >= 0.5});

  game.play(
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3)
  );

  return game;
}

let promise = mkdir('./sandwich');

for (let i of [1, 2]){
  promise = promise
    .then(() => makeANewGame())
    .then((game) => game.toJson())
    .then((json) => {
      return {
        fileName: `./sandwich/${new Date().valueOf()}.json`,
        data: json
      }
    })
    .then(({fileName, data}) => {
       return writeFile(fileName, data)
    });
}

promise.catch(err => console.error(err));