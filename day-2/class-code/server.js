'use strict';

let TicTacToeGame = require('./src/tic-tac-toe-game');
let DiskDb = require('./src/disk-db');
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
let db = new DiskDb(dir)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressFactoryFunction.static('static'));

// handle deletes
app.use(function(req, res, next){
  req.method = req.body['X-HTTP-METHOD'] && req.body['X-HTTP-METHOD'].toUpperCase() || req.method;
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
  
  db.delete(game.fileName)
    .then(() => globalGames.splice(gameIndex,1))
    .then(() => res.redirect('/'))
    .catch(err => res.status(500).end(err));
  
});

app.post('/:gameIndex', function(req, res){
  let gameIndex = req.params.gameIndex;
  let game = getGame(gameIndex);
  if(!game){
    res.status(404).end('HOW YOU DO THAT?!');
  }

  game.game.play(Number.parseInt(req.body.row), Number.parseInt(req.body.col));

  db.save(game.fileName, game.game.toJson())
    .then(() => res.redirect(`/${gameIndex}`))
    .catch(err => {
      res.status(500).end(err)
    });  
  
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
  let game = {
    fileName: new Date().valueOf() + ".json",
    game: new TicTacToeGame({humanFirst: Math.random() >= 0.5})
  }
  console.log(game.game);
  
  db.save(game.fileName, game.game.toJson())
    .then(() => globalGames.push(game))
    .then(() => res.redirect(`/${globalGames.length - 1}`))
    .catch(err => {
      res.status(500).end(err)
    });

});

app.get('/', function(req, res){
  res.render('index.html', {
    now: new Date().valueOf(),
    message: 'Tic Tac Toe Games',
    games: globalGames
  })
});

readdir(dir)
  //.map(files => files.filter((filename)=> filename !== ".DS_Store"))
  .map((filename) => bluebird.props({
    json: readfile(`${dir}/${filename}`, 'utf8'),
    fileName: filename
  }))
  .map(gameDesc => {
    gameDesc.game = TicTacToeGame.fromJson(gameDesc.json);
    return gameDesc;
  })
  .then((games) => {
    globalGames = games;
    let port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`Listening really hard on port ${port}`));
  })
  .catch(err => console.error(err));
