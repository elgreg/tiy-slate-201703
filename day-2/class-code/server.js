'use strict';

let TicTacToeGame = require('./src/tic-tac-toe-game.js');
let fs = require('fs');
let bluebird = require('bluebird');

let readdir = bluebird.promisify(fs.readdir);
let readfile = bluebird.promisify(fs.readFile);
let expressFactoryFunction = require('express');
let bodyParser = require('body-parser');
let nunjucks = require('nunjucks');

let app = expressFactoryFunction();

nunjucks.configure('templates/', {
  autoescape: true,
  express: app,
  watch: true
})


/// Use promises to

// read the sandwich dir

// read the contents of each file

// objectify the contents into a module-level list of games

let dir = './sandwich';

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressFactoryFunction.static('static'));

app.use(function(req, res, next){
  console.log(`A request went by to ${req.path}`);
  next();
});


// handle deletes
app.use(function(req, res, next){
  console.log(`Some custom-ass middleware`);
  req.method = req.body['X-HTTP-METHOD'] && req.body['X-HTTP-METHOD'].toUpperCase() || req.method;
  console.log(req.method);
  next();
});

app.use(function(err, req, res, next){
  console.error('Something bad happened', req.path, err);
  next(err);
})

let globalGames = [];

function getGame(gameIndex){
  if(Number.isNaN(gameIndex) || !globalGames[gameIndex]){
    return null;
  }
  return globalGames[gameIndex];
}

app.delete('/:gameIndex', function(req, res){
  let gameIndex = req.params.gameIndex;
  let game = getGame(gameIndex)
  if(!game){
    res.status(404).end('HOW YOU DO THAT?!');
  }
  // TODO: write game.delete()
  // game.delete()
  globalGames.splice(gameIndex,1);
  res.redirect('/');
});

app.post('/:gameIndex', function(req, res){
  let gameIndex = req.params.gameIndex;
  let game = getGame(gameIndex);
  if(!game){
    res.status(404).end('HOW YOU DO THAT?!');
  }

  game.play(Number.parseInt(req.body.row), Number.parseInt(req.body.col));

  res.redirect(`/${gameIndex}`);
});

app.get('/:gameIndex', function(req, res){
  let gameIndex = req.params.gameIndex;
  let game = getGame(gameIndex);
  if(!game){
    return res.redirect('/')
  }
  res.render('game.html', {
    gameIndex: gameIndex,
    game: game
  });
});


app.post('/', function(req, res){
  let game = new TicTacToeGame(Math.random() >= 0.5)

  globalGames.push(game);
  
  res.redirect(`/${globalGames.length - 1}`);

  // TODO: Persist this to disk
  // game.save()
  //   .then(globalGames.push(game))
  //   .then(() => res.redirect(`/${globalGames.length - 1}`))
  //   .catch(err => {
  //     res.status(500).end(err)
  //   });
});

app.get('/', function(req, res){
  res.render('index.html', {
    now: new Date().valueOf(),
    message: 'Tic Tac Toe Games',
    games: globalGames
  })
});



readdir(dir)
  .map((filename) => readfile(`${dir}/${filename}`, 'utf8'))
  .map(TicTacToeGame.fromJson)
  .then((games) => {
    globalGames = games;
    let port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`Listening really hard on port ${port}`));
  })
  .catch(err => console.error(err));
