let Player = (name, marker) => {
    
    return {name, marker};
}

let Bot = (name, marker) => {
    return{name, marker};
}

let Gameboard = (function (){

    let _board = [];
    let _cellsOccupied = [];  //cellsOccupied is an array, because arrays are passed by refference
    _board = [["","",""],["","",""],["","",""]];
     
    let isValid = (position) => {
        if(_board[position[0]][position[1]] == "")
             return true;
         else 
            return false;
    }
    let isFull = () => {
        if(_cellsOccupied.length == 9)
            return true;
        else 
           return false;  
    }
    let getBoard = () => {
        return _board.slice();
    }
    //adds a marker on the specifiend position, then calls the checkWinner function to check if the 
    //newly added marker determined the end of the game
    //it return the winner(null if there is no winner yet)
    let addMarker = (position, marker) => {
       
        let winner = null;
        if(_board[position[0]][position[1]] == "" && _cellsOccupied.length < 9)
        {
             _board[position[0]][position[1]] = marker;
            document.getElementById(`${position[0]}${position[1]}`).innerHTML = `<img class = "xoicon" src = "./icons/${marker}.png">`;
            _cellsOccupied.push(null);
            //every time a marker is added, the length of cellsOccupated grows by 1
        }
        //check for winner on the position where the last marker was added, if there are at least
        //3 occupied cells
        if(_cellsOccupied.length >= 3)
        {
            winner =  checkWinner(position);
        }
       
        return winner;
    };

    //checks if the specified position determined the end of the game, and returns
    //the winner ('x', 'o' or null)
    let checkWinner = (position) => {
          
        let winner = null;
        //position is on main diagonal
        if(position[0] == position[1])
        {
           if(_board[0][0] == _board[1][1] && _board[0][0] == _board[2][2])
            {
                winner = _board[0][0];
            }
        }
        //position is on secondry diagonal
        if(position[1] == 3 - position[0] - 1)
        {
            if(_board[0][2] == _board[1][1] && _board[0][2] == _board[2][0])
            {
                winner = _board[0][2];
            }
        }
        //position is not on any diagonal so only check respective row and column
        if(_board[position[0]][0] == _board[position[0]][1] && _board[position[0]][0] == _board[position[0]][2])
        {
            winner = _board[position[0]][0];
        }
        if(_board[0][position[1]] == _board[1][position[1]] && _board[0][position[1]] == _board[2][position[1]])
        {
            winner = _board[0][position[1]];
        }
        
        return winner;
    };

    let refreshBoard = () => {

        _board = [["","",""],["","",""],["","",""]];
        _cellsOccupied = [];
        let icons = document.querySelectorAll('.xoicon');
        icons.forEach(item => {
             item.remove();
        });

    }
    return {getBoard, isValid, isFull, addMarker, checkWinner, refreshBoard};

})();

let GameFlow = (function() {

    let Player1 = Player('Player 1', 'x');
    let Player2 = Player('Player 2', 'o');
    let currentPlayer = Player1;
    let winner = null;

   
    let playGame = () =>{
        
        //console.log(currentPlayer);
         Player1 = Player('Player 1', 'x');
         Player2 = Player('Player 2', 'o');
        currentPlayer = Player1;
        winner = null;
        
        function play () {

            if(Gameboard.isFull() || winner != null || currentGameMode != "player")
            {
                console.log("Game over!!!!");
                cells.forEach(cell => {

                    cell.removeEventListener('click', play);
                 });  //if board is full or there is a winner, don't allow
                //filling cells anymore
                
            }
            
            let cellPos = this.id;
           // console.log(this);
           // console.log(cellPos);
            if(Gameboard.isValid(cellPos) && !Gameboard.isFull() && winner == null)
            {
                currentPlayer = playTurn(cellPos, currentPlayer);
            }
            if(winner != null)
                {
                    let winnerAnnouncement = document.querySelector('.winner-screen');
                    console.log(winnerAnnouncement);
                    winnerAnnouncement.querySelector('.winner-text').textContent = `${winner}`;
                    winnerAnnouncement.classList.replace('winner-screen', 'winner-screen-show');
                }
            console.log("winner:" + winner);
    
        }
    
        let cells = document.querySelectorAll('.cell');
            cells.forEach(item => {

            item.addEventListener('click', play);

    });
           
            
    return winner;
};
   
//option for playing game against bot
 let playGameBot = () =>{

    //console.log(currentPlayer);
    Player1 = Player('Player 1', 'x');
    Player2 = Bot('Player 2', 'o');
    currentPlayer = Player1;
    winner = null;
    
    
    //checks if there are empty cells on the board
    function isMoveLeft(board)
    {
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                if(board[i][j] == "")
                   return true;
            }
        }
        return false;
    }

    //evaluates the board and checks for winners
    function evaluate(board)
   {
     
    // Checking for Rows for X or O victory.
    for(let row = 0; row < 3; row++)
    {
        if (board[row][0] == board[row][1] &&
            board[row][1] == board[row][2])
        {
            if (board[row][0] == "o")
                return +10;
                 
            else if (board[row][0] == "x")
                return -10;
        }
    }
  
    // Checking for Columns for X or O victory.
    for(let col = 0; col < 3; col++)
    {
        if (board[0][col] == board[1][col] &&
            board[1][col] == board[2][col])
        {
            if (board[0][col] == "o")
                return +10;
  
            else if (board[0][col] == "x")
                return -10;
        }
    }
  
    // Checking for Diagonals for X or O victory.
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2])
    {
        if (board[0][0] == "o")
            return +10;
             
        else if (board[0][0] == "x")
            return -10;
    }
  
    if (board[0][2] == board[1][1] &&
        board[1][1] == board[2][0])
    {
        if (board[0][2] == "o")
            return +10;
             
        else if (board[0][2] == "x")
            return -10;
    }
}
    // This is the minimax function. It
    // considers all the possible ways
    // the game can go and returns the
    // value of the board
    function minimax(board, depth, isMax)
    {
 
        let score = evaluate(board);
        // If Maximizer has won the game
        // return his/her evaluated score
        if(score == 10)
        {
            return score;
        }
        // If Minimizer has won the game
        // return his/her evaluated score
        if(score == -10)
        {
            return score;
        }

        // If there are no more moves and
        // no winner then it is a tie
        if (isMoveLeft(board) == false)
        {
            return 0;
        }
        //if it's maximiser's move (the bot)
        if(isMax)
        {

            let best = -1000;

            for(let i = 0; i < 3; i++)
            {
                for(let j = 0; j < 3; j++)
                {
                    if(board[i][j] == "")
                    {
                        // Make the move
                         board[i][j] = "o";
  
                        // Call minimax recursively
                        // and choose the maximum value
                        //isMax toggles between true and false
                         best = Math.max(best, minimax(board, depth + 1, !isMax));
  
                         // Undo the move
                         board[i][j] = "";
                    }
                }
            }
            return best
        }
        //if it's minimiser's move (the opponent)
        else
        {

            let best = 1000;

            for(let i = 0; i < 3; i++)
            {
                for(let j = 0; j < 3; j++)
                {
                    if(board[i][j] == "")
                    {
                        // Make the move
                         board[i][j] = "x";
  
                        // Call minimax recursively
                        // and choose the maximum value
                        //isMax toggles between true and false
                         best = Math.min(best, minimax(board, depth + 1, !isMax));
  
                         // Undo the move
                         board[i][j] = "";
                    }
                }
            }
            return best
        }
         // Else if none of them have
        // won then return 0
        return 0;
    }
   

   function findBestMove(board)
   {
    let bestVal = -1000;
    let bestMove = "";
    // Traverse all cells, evaluate
    // minimax function for all empty
    // cells. And return the cell
    // with optimal value.
    for(let i = 0; i < 3; i++)
    {
        for(let j = 0; j < 3; j++)
        {
            if(board[i][j] == "")
            {
                board[i][j] = "o";
                let moveVal = minimax(board, 0, false);
                board[i][j] = "";
                // If the value of the current move
                // is more than the best value, then
                // update best
                if (moveVal > bestVal)
                {
                    bestMove = `${i}${j}`;
                    bestVal = moveVal;
                }
            }
           
        }
    }
    return bestMove;

   }
        function play () {
             
            //make sure the gameboard isn'full,
            //there is no winner yet and
            //the game mode option hasn't change durring the game
           if(Gameboard.isFull() || winner != null || currentGameMode != "bot")
           {
                console.log("Game over!!!!");
                cells.forEach(cell => {

                   cell.removeEventListener('click', play);
                }); //if board is full or there is a winner, don't allow
               //filling cells anymore
           
               
           }
            let cellPos = this.id;
          //  console.log(this);
           // console.log(cellPos);
            if(currentPlayer.name == "Player 1" && Gameboard.isValid(cellPos) && !Gameboard.isFull() && winner == null && currentGameMode == "bot")
            {
                currentPlayer = playTurn(cellPos, currentPlayer);
            }
           // console.log(currentPlayer);
           //check again in case the game ended after the 'x' player's turn
           if(Gameboard.isFull() || winner != null || currentGameMode != "bot")
           {
               console.log("Game over!!!!");
               cells.forEach(cell => {

                   cell.removeEventListener('click', play);
                }); //if board is full or there is a winner, don't allow
               //filling cells anymore
             
       
           }
           
            if(currentPlayer.name == "Player 2")
            {
                let boardCopy = Gameboard.getBoard();
              //  console.log(isMoveLeft(boardCopy));
                let botMove = findBestMove(boardCopy);
                currentPlayer = playTurn(botMove, currentPlayer);
            }
           
            console.log("winner:" + winner);
    
        }
        let cells = document.querySelectorAll('.cell');
            cells.forEach(item => {
            item.addEventListener('click', play);

    });
   
 }

//plays a single turn: gets the cell postion that was clicked, and the current player
//and calls the addMarker function, then returns the next player
    let playTurn = (cellPos, currentPlayer) => {

        console.log(currentPlayer);
        winner = Gameboard.addMarker(cellPos, currentPlayer.marker);
        if(currentPlayer.name == Player1.name && currentPlayer.marker == Player1.marker)
        {
            currentPlayer = Player2;
        }
        else
        {
            currentPlayer = Player1;
        }  
        console.log(currentPlayer);
        return currentPlayer;
    };
    return {playGame, playGameBot};
})();


function determineGameMode()
{
    const playMode = document.querySelector('input[name = "playMode"]:checked').value;
    if(playMode == "player")
    {
        GameFlow.playGame();
    }
    else if(playMode == "bot")
    {
        GameFlow.playGameBot();
    }   
}
function playChosenGameMode(playMode)
{
    if(playMode == "player")
    {
        console.log("playing vs player");
        timer = setInterval(GameFlow.playGame(), 1000);
    }
    else if(playMode == "bot")
    {
        console.log("playing vs bot");
        timer = setInterval(GameFlow.playGameBot(), 1000);
    }   
}

const playModeBtns = document.querySelectorAll('input[type = "radio"]');
let currentGameMode = "bot";
playModeBtns.forEach(option => {
    option.addEventListener('click', () => {
       
        currentGameMode = option.value;
        Gameboard.refreshBoard();
        playChosenGameMode(option.value);
        console.log(option.value);
    });
});

const startBtn = document.querySelector('.start-button');
const startMenu = document.querySelector(".start");
const game = document.querySelector(".game");
startBtn.addEventListener('click', () =>{
    startMenu.classList.replace("start", "start-hidden");
    game.classList.replace("game", "game-show");
   
});

const restartBtn = document.querySelector('.restart-button');
restartBtn.addEventListener('click', () => {
    Gameboard.refreshBoard();
    determineGameMode();
});



