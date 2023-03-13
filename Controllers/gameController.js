const gamecode = require('../Models/gamecode');

function GameCode(n) {
    var res = "";
    while (res.length < n) {
        res += String(Math.floor(Math.random() * 10));
    }
    return res;
}

function checkWin(grid) {
  // check rows
  for (let i = 0; i < 3; i++) {
    if (grid[i][0] !== '' && grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
      return grid[i][0];
    }
  }
  // check columns
  for (let j = 0; j < 3; j++) {
    if (grid[0][j] !== '' && grid[0][j] === grid[1][j] && grid[1][j] === grid[2][j]) {
      return grid[0][j];
    }
  }
  // check diagonals
  if (grid[0][0] !== '' && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
    return grid[0][0];
  }
  if (grid[0][2] !== '' && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
    return grid[0][2];
  }
  // if no winner found
  return null;
}

exports.createNewGame = async (req, res) => {
    try {
        const gc = GameCode(6);
        const newGame = gamecode({
            code: gc,
            grid: [['', '', ''], ['', '', ''], ['', '', '']]
        });
        const savednewGame = await newGame.save();
        if (savednewGame === null) {
            res.status(403).json({
                status: "error",
                data: {
                    message: 'cannot initialize the game'
                }
            });
            return;
        }
        res.status(200).json({
            status: "success",
            data: {
                gamecode: gc,
                turn: "x"
            }
        });
        return;
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: 'server error',
                err: err.message
            }
        });
        return;
    }
};

exports.change = async (req, res) => {
    try {
        const { gc, x, y, val } = req.body;
        var currGame = await gamecode.findOne({ code: gc });
        if (currGame === null) {
            res.status(404).json({
                status: "error",
                data: {
                    message: 'game dosenot exsists'
                }
            });
            return;
        }
        var currGrid = currGame.grid;
        currGrid[x][y] = val;
        currGame.grid = currGrid;
        const savedGame = await currGame.updateOne({ grid: currGrid });
        if (savedGame === null) {
            res.status(405).json({
                status: "error",
                data: {
                    message: 'error in saving progress'
                }
            });
            return;
        }
        const game = await gamecode.findOne({ code: gc });
        const winning = checkWin(game[0].grid);
        if(winning!==null){
            await gamecode.deleteOne({code: gc});
        }
        res.status(200).json({
            status: "success",
            data: {
                game: game,
                turn: val=='x'?"y":"x",
                winning
            }
        });
        return;
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: 'server error',
                err: err.message
            }
        });
        return;
    }
};


exports.getProgress = async(req, res) => {
    try {
        const gc = req.params.gc;
        const game = await gamecode.find({code: gc});

        if (game === null) {
            res.status(404).json({
                status: "error",
                data: {
                    message: 'no such game'
                }
            });
            return;
        }
        var oc = 0, xc=0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if(game[0].grid[i][j]==="x"){
                    xc++;
                }
                else if(game[0].grid[i][j]==="o"){
                    oc++;
                }
            }
        }
        const winning = checkWin(game[0].grid);
        if(winning!==null){
            await gamecode.deleteOne({code: gc});
        }
        res.status(200).json({
            status:"success",
            data:{
                game,
                turn: xc===oc?"x":"o",
                winning
            }
        });
        return;
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: 'server error',
                err: err.message
            }
        });
        return;
    }
};