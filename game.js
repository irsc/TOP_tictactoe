
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

    const setTurn = () =>{turnPlayer = getTurn()== 0 ? 1 : 0;};
    const setTurnValue = (value) =>{turnPlayer = value};
    const getTurn = () => turnPlayer;
    const getGameStatus = () => gameStatus;
    const setGameStatus = (value) => {gameStatus = value};
    const setBoard = ()=>{currentBoard= gameboard.getGameboard();};
    
    function play(varPlay) {
        let move = varPlay;
        dom.updateScore(players[0].getWins(), players[1].getWins(), ties);
        let index = getTurn();

        let player = players[index];
        if(!player.getHumanity()){
            move = computerPlay();
            dom.changeCell(dom.getElementBoard(move-1), turnPlayer);
        }
            
        if(currentBoard.includes(move)){
            player.setPositions(move);
            currentBoard = currentBoard.filter(position => position !== move);
            if(Array.isArray(checkWin(player))){
                dom.winnerRound(player.getName());
                dom.highlightCell(checkWin(player));
                player.addWin();
                setGameStatus(true);
                setBoard();
                players[0].resetPositions();
                players[1].resetPositions();
            }else if(currentBoard.length == 0){
                dom.tieRound();
                ties++;
                setGameStatus(true);
                setBoard();
                players[0].resetPositions();
                players[1].resetPositions();
            }
        }      
        dom.updateScore(players[0].getWins(), players[1].getWins(), ties);
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
                return winPositions[key];
            }
        }
        
    };

    function computerPlay(){
        let rndIndex = Math.floor(Math.random() * currentBoard.length);
        return currentBoard[rndIndex];
    };

    return {play, getTurn, setTurn, setTurnValue, getGameStatus, setGameStatus};
    
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

    let ticTacToe;
    const setGame = () =>ticTacToe =  game();

    let rounds = 1;
    const addRound = ()=> rounds++;
    const getCurrentRound = ()=>rounds;

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
        setGame();
        updateTurn(0);
        for (let index = 0; index < boardContainer.children.length; index++) {
            cells[index].addEventListener("click", ()=>{
                clickCell(cells[index]);
            });  
        };
        formPlayers.classList.add("disabled");
        roundComputer();
    });

    startNewGameBtn.addEventListener("click",()=>{
        window.location.reload();
    });

    newRoundBtn.addEventListener("click",()=>{
        addRound();
        updateTurn(0);
        for (let index = 0; index < boardContainer.children.length; index++) {
            cells[index].classList.remove("cross");
            cells[index].classList.remove("ou");
            cells[index].classList.remove("winHighlight");
            cells[index].classList.add("cellHover");
        };
        newRoundBtn.classList.add("disabled");
        boardContainer.removeEventListener("click", eventHandler, true);
        roundComputer();
    });

    function eventHandler(event){
        event.stopImmediatePropagation();
    }
   
    function showBoard(){
        panelBoard.classList.remove("disabled");
        panelScore.classList.remove("disabled");
        panelRound.classList.remove("disabled");
        panelReset.classList.remove("disabled");
        
    };

    function roundComputer(turn = 0){
        const players = getPlayers();
        if(!players[turn].getHumanity()){
            ticTacToe.play();
            gameContinue();
        }
    };


    function getElementBoard(index){
        return cells[index];
    }

    function getPlayers(){
        let playerX = createPlayer("Player X", inputX.value == "human");
        let playerO = createPlayer("Player O", inputO.value == "human");
        return [playerX, playerO];
    };

    
    function updateTurn(turnPlayer, end = false){
        const players = getPlayers();
        if(end){
            let winner = "";
            if(scoreX.innerText == scoreO.innerText){
                winner = "Draw! No winner for this game.";
            }else if(scoreX.innerText > scoreO.innerText  ){
                winner = "Player X wins the game!";
            }else if(scoreX.innerText < scoreO.innerText){
                winner = "Player O wins the game!";
            }
            turn.innerText = "Game completed. " + winner;
        }else{
            turn.innerText = "Turn for " + players[turnPlayer].getName();
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

    function clickCell(element){
        if(!element.classList.contains("cross") && !element.classList.contains("ou")){
            changeCell(element, ticTacToe.getTurn());
            ticTacToe.play(element.id);
            gameContinue();
        }
    }

    function gameContinue(){
        if(ticTacToe.getGameStatus() ){
            boardContainer.addEventListener("click",eventHandler , true);

            if(getCurrentRound() == numRounds.value){
                updateTurn(ticTacToe.getTurn(), true);
            }else{
                newRoundBtn.classList.remove("disabled");
                ticTacToe.setGameStatus(false);
                ticTacToe.setTurnValue(0);
            }
            
        }else{
            ticTacToe.setTurn();
            updateTurn(ticTacToe.getTurn());
            roundComputer(ticTacToe.getTurn());
        }
    }
   

    function changeCell(element, turnPlayer){
        if(turnPlayer == 0){
            element.classList.add("cross");
        }else if(turnPlayer == 1){
            element.classList.add("ou");
        }
    }

    function highlightCell(array){
        for (let index = 0; index < boardContainer.children.length; index++) {
            cells[index].classList.remove("cellHover");
            if(array.includes(String(index+1))){
                cells[index].classList.add("winHighlight");
            };
        };
    }

    return {winnerRound, tieRound, updateScore, changeCell, getElementBoard, getPlayers, highlightCell};

})();