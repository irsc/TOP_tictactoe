
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

function game(gameboard, player1, player2){
    let currentBoard= gameboard.getGameboard();
    let ties = 0;
    const players = [player1, player2];
    dom.updateScore(player1.getWins(), player2.getWins(), ties);

    function play(rounds=3) {
        let index = 0;
        for (let r = 0; r < rounds; r++) {
            while (currentBoard.length > 0) {
                let player = players[index];
                let play;
                dom.updateTurn(player);
                if(player.getHumanity()){
                    play = prompt("Player "+ player.getName() +" position");
                }else{
                    play = computerPlay();
                }
                
                if(currentBoard.includes(play)){
                    player.setPositions(play);
                    currentBoard = currentBoard.filter(position => position !== play);
                    if(checkWin(player)){
                        alert(player.getName() + " wins with "+ player.getPositions());
                        dom.winnerRound(player);
                        player.addWin();
                        break;
                    }
                    if(currentBoard.length == 0){
                        alert("Draw...! no winner this time");
                        ties++;
                        break;
                    }
                    index==0? index=1 : index=0;
                    console.log(currentBoard);
                }else{
                    alert("invalid position, try again");
                }
                
                
            };
            dom.updateScore(player1.getWins(), player2.getWins(), ties);
            console.log(player1.getWins(), player2.getWins(), ties);
            player1.resetPositions();
            player2.resetPositions();
            currentBoard= gameboard.getGameboard();
            prompt("Play again");
            
        }
        console.log(player1.getName() + " wins: " +  player1.getWins());
        console.log(player2.getName() + " wins: " +  player2.getWins());
        console.log("End of the game!");
        player1.resetWins();
        player2.resetWins();
        dom.updateTurn(player1, true);
        ties = 0;
        
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

    return {play};
    
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

    const panelBoard = document.getElementById("panel-board");
    const panelScore = document.getElementById("panel-score");
    const panelRound = document.getElementById("panel-round");
    const panelReset = document.getElementById("panel-reset");
    
    formPlayers.addEventListener("change",()=>{
        if(inputO.checkValidity()  && inputX.checkValidity()){
            startGameBtn.removeAttribute("disabled");
        }
    });
    startGameBtn.addEventListener("click",()=>{
        panelBoard.classList.remove("disabled");
        panelScore.classList.remove("disabled");
        panelRound.classList.remove("disabled");
        panelReset.classList.remove("disabled");
        
        let playerX = createPlayer("Player X", inputX.value == "human");
        let playerO = createPlayer("Player O", inputO.value == "human");
        setTimeout(game(gameboard, playerX,playerO).play(numRounds.value), 5000);
        
    });

    startNewGameBtn.addEventListener("click",()=>{
        window.location.reload();
    });
    
    function updateTurn(player, end = false){
        if(end){
            turn.innerText = "Game completed";
        }else{
            turn.innerText = "Turn for " + player.getName();
            console.log(turn.innerText);
        }
        
    };
    function winnerRound(player){
        turn.innerText = player.getName() + " wins this round!";
    };
    function updateScore(playX, playO, playTie){
            scoreX.innerText = playX;
            scoreO.innerText = playO;
            scoreTie.innerText = playTie;
    };
    return {updateTurn, winnerRound, updateScore};

})();