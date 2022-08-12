let Player = (name, marker) => {
    
    return {name, marker};
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
    return {_board, isValid, isFull, addMarker, checkWinner};

})();

let GameFlow = (function() {

    let Player1 = Player('Player 1', 'x');
    let Player2 = Player('Player 2', 'o');
    let currentPlayer = Player1;
    let winner = null;

    let playGame = () =>{
        
        console.log(currentPlayer);
        function play () {
             
            
            let cellPos = this.id;
            console.log(cellPos);
            if(Gameboard.isValid(cellPos) && !Gameboard.isFull() && winner == null)
            {
                currentPlayer = playTurn(cellPos, currentPlayer);
            }
            if(Gameboard.isFull() || winner != null)
            {
                console.log("Game over!!!!");
                this.removeEventListener('click', play); //if board is full or there is a winner, don't allow
                //filling cells anymore
                
            }
            console.log("winner:" + winner);
    
        }

        let cell = document.querySelectorAll('.cell');
            cell.forEach(item => {

            item.addEventListener('click', play);

    });
           
            
    return winner;
};
    
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
    return {playGame};
})();

console.log(Gameboard._board[1][2]);
/*console.log(Gameboard.addMarker("20", 'x'));
console.log(Gameboard.addMarker("11", 'x'));
console.log(Gameboard.addMarker("02", 'x'));
console.log(Gameboard.addMarker("01", 'x'));
console.log(Gameboard._board[0][1]);*/
//console.log(Gameboard.checkWinner([0,2]));
console.log(GameFlow.playGame());


