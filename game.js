
const gameboard =(function (){
    let gameboard = ["1","2","3","4","5","6","7","8","9"];
    const getGameboard = () => gameboard;
    return {getGameboard};
})();


function createPlayer (name, human) {
    let positions = [];
    let wins = 0;
    const getName = () => name;
    const getHumanity = () => human;
    const getPositions = () => positions;
    const setPositions = (move) => positions.push(move);
    const resetPositions = () => positions = [];
    const addWin = () => wins++;
    const getWins = () => wins;
    const resetWins = () => wins = 0;
  
    return { getName, getHumanity, getPositions, setPositions, resetPositions, addWin, getWins, resetWins};
  }

function game(){
    let currentBoard= gameboard.getGameboard();
    let turnPlayer = 0;
    let ties = 0;
    let gameStatus = false;
    const players = dom.getPlayers();
    console.log(players);

    const setTurn = () =>{turnPlayer = getTurn()== 0 ? 1 : 0;};
    const getTurn = () => turnPlayer;
    const getGameStatus = () => gameStatus;
    const setGameStatus = (value) => {gameStatus = value};
    const setBoard = ()=>{currentBoard= gameboard.getGameboard();};
    

    
    function play(tic) {
        dom.updateScore(players[0].getWins(), players[1].getWins(), ties);
        let index = getTurn();

        let player = players[index];
        let move = tic;
        if(!player.getHumanity()){
            move = computerPlay();
        }
            
        if(currentBoard.includes(move)){
            player.setPositions(move);
            currentBoard = currentBoard.filter(position => position !== move);
            if(checkWin(player)){
                dom.winnerRound(player.getName());
                player.addWin();
                setGameStatus(true);
                setBoard();
            }else if(currentBoard.length == 0){
                dom.tieRound();
                ties++;
                setGameStatus(true);
                setBoard();
            }

            console.log(currentBoard);
        }
                
                
            
        dom.updateScore(players[0].getWins(), players[1].getWins(), ties);
 /*        console.log(player1.getWins(), player2.getWins(), ties);
        player1.resetPositions();
        player2.resetPositions();
        currentBoard= gameboard.getGameboard(); */
        //prompt("Play again");
      /*      
        } */
       /*  console.log(player1.getName() + " wins: " +  player1.getWins());
        console.log(player2.getName() + " wins: " +  player2.getWins());
        console.log("End of the game!");
        player1.resetWins();
        player2.resetWins();
        dom.updateTurn(player1, true);
        ties = 0;  */
        
    }
    
    function checkWin(player){
        const winPositions = {
            row1: ["1","2","3"],
            row2: ["4","5","6"],
            row3: ["7","8","9"],
            col1: ["1","4","7"],
            col2: ["2","5","8"],
            col3: ["3","6","9"],
            dia1: ["1","5","9"],
            dia2: ["3","5","7"]
        };
        for (const key in winPositions) {
            let check = true;
            for (let number of winPositions[key]) {
                check = check && player.getPositions().includes(number);
            }
            if(check){
                return check;
            }
        }
        
    };

    function computerPlay(){
        let rndIndex = Math.floor(Math.random() * currentBoard.length);
        return currentBoard[rndIndex];
    };

    return {play, getTurn, setTurn, getGameStatus};
    
}

const dom =(function gameDom() {
    const formPlayers = document.getElementById("formPlayers");
    const inputX = document.getElementById("playerX");
    const inputO = document.getElementById("playerO");
    const startGameBtn = document.getElementById("startGame");
    const numRounds = document.getElementById("numRounds");
    const turn = document.getElementById("turn");
    const scoreX = document.getElementById("scoreX");
    const scoreO = document.getElementById("scoreO");
    const scoreTie = document.getElementById("scoreTie");

    const startNewGameBtn = document.getElementById("startNew");
    const newRoundBtn = document.getElementById("newRound");

    const panelBoard = document.getElementById("panel-board");
    const panelScore = document.getElementById("panel-score");
    const panelRound = document.getElementById("panel-round");
    const panelReset = document.getElementById("panel-reset");

    const boardContainer = document.getElementById("board-container");

    let cells = [];
    for (let index = 0; index < boardContainer.children.length; index++) {
        cells[index] = boardContainer.children[index];
    };

    formPlayers.addEventListener("change",()=>{
        if(inputO.checkValidity()  && inputX.checkValidity()){
            startGameBtn.removeAttribute("disabled");
        }
    });
    startGameBtn.addEventListener("click",()=>{
        showBoard();
        const ticTacToe = game();
        updateTurn(0);
        for (let index = 0; index < boardContainer.children.length; index++) {
            cells[index].addEventListener("click", ()=>{
                clickCell(cells[index], ticTacToe);
            });  
        };
        startGameBtn.setAttribute("disabled", "");

    });

    startNewGameBtn.addEventListener("click",()=>{
        window.location.reload();
    });

    newRoundBtn.addEventListener("click",()=>{
        updateTurn(0);

        for (let index = 0; index < boardContainer.children.length; index++) {
            cells[index].classList.remove("cross");
            cells[index].classList.remove("ou");
        };
        newRoundBtn.classList.add("disabled");

        boardContainer.removeEventListener("click", function(event) {
            event.stopImmediatePropagation();
        });
    });

   

    function showBoard(){
        panelBoard.classList.remove("disabled");
        panelScore.classList.remove("disabled");
        panelRound.classList.remove("disabled");
        panelReset.classList.remove("disabled");
        
    };

    function getPlayers(){
        let playerX = createPlayer("Player X", inputX.value == "human");
        let playerO = createPlayer("Player O", inputO.value == "human");
        return [playerX, playerO];
    };
    
    function updateTurn(turnPlayer, end = false){
        const players = getPlayers();
        if(end){
            turn.innerText = "Game completed";
        }else{
            turn.innerText = "Turn for " + players[turnPlayer].getName();
            console.log(turn.innerText);
        }
        
    };
    function winnerRound(playerName){
        turn.innerText = playerName + " wins this round!";
    };
    function tieRound(){
        turn.innerText = "Draw! no winner this round!";
    };
    function updateScore(playX, playO, playTie){
            scoreX.innerText = playX;
            scoreO.innerText = playO;
            scoreTie.innerText = playTie;
    };

    function clickCell(element, game){
        if(!element.classList.contains("cross") && !element.classList.contains("ou")){
            changeCell(element, game.getTurn());
            game.play(element.id);
            if(game.getGameStatus()){
                boardContainer.addEventListener("click", function(event) {
                    event.stopImmediatePropagation();
                }, true);
                newRoundBtn.classList.remove("disabled");
        
            }else{
                game.setTurn();
                updateTurn(game.getTurn());
            }
            
        }
    }

    function changeCell(element, turnPlayer){
        if(turnPlayer == 0){
            element.classList.add("cross");
        }else if(turnPlayer == 1){
            element.classList.add("ou");
        }
    }

    return {updateTurn, winnerRound, tieRound, updateScore, getPlayers};

})();