'use strict';

let TicTacToeGame = require('./src/tic-tac-toe-game.js');
let fs = require('fs');
let bluebird = require('bluebird');

let readdir = bluebird.promisify(fs.readdir);
let readfile = bluebird.promisify(fs.readFile);


/// Use promises to

// read the sandwich dir

// read the contents of each file

// objectify the contents into a module-level list of games

let dir = './sandwich';

let loadedGames = [];

readdir(dir)
  .map((filename) => readfile(`${dir}/${filename}`, 'utf8'))
  .map(TicTacToeGame.fromJson)
  .then((games) => loadedGames = games)
  .then(() => console.log(loadedGames))
  .catch(err => console.error(err));


module.exports = loadedGames;