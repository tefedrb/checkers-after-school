let board = [];

const cells = document.querySelectorAll("td")
let redPieces = document.querySelectorAll(".redPiece")
let blackPieces = document.querySelectorAll(".blackPiece")
const divider = document.getElementById("divider")
const redTurn = document.querySelector(".redTurn");
const blackTurn = document.querySelector(".blackTurn");

let redScore = 12
let blackScore = 12
let turn = true;
let playerPieces;

let selectedPiece = {
    pieceId: -1,
    indexOfBoardPiece: -1,
    isKing: false,
    opacity: 1, 
    moveOptions: null,
    inJumpSequence: false
}

// NEED TO SWITCH TO KING IF WE GET TO THE END OF THE BOARD
const giveListeners = () => {
    const jumped = selectedPiece.inJumpSequence;
    if(jumped){
        // board.forEach(cur => cur.removeEventListener("click", getPlayerPieces))
        const bothPieces = [...blackPieces, ...redPieces];
        bothPieces.forEach(cur => cur.removeEventListener("click", beginChainedFunctions));
        return getPlayerPieces();
    }
    if (turn) {
        for(let i = 0; i < (jumped ? 0 : blackPieces.length); i++){
            blackPieces[i].removeEventListener("click", beginChainedFunctions);
        }
        for (let i = 0; i < redPieces.length; i++) {
            redPieces[i].addEventListener("click", beginChainedFunctions);
        }
    } else {
        for(let i = 0; i < (jumped ? 0 : redPieces.length); i++){
            redPieces[i].removeEventListener("click", beginChainedFunctions);
        }
        for (let i = 0; i < blackPieces.length; i++) {
            blackPieces[i].addEventListener("click", beginChainedFunctions);
        }
    }
}
giveListeners();
// Is there hoisting in ES6 syntax? If so, how do you write a function in ES6 that allows
// for hoisting? And if not, why is there no hoisting? Step down rule

function beginChainedFunctions(){
    getPlayerPieces();
}

function getPlayerPieces() {
    if (turn) {
        playerPieces = redPieces
    } else {
        playerPieces = blackPieces
    }
    getSelectedPiece();
}

function setOpacity(off = false) {
    // getSelectedPiece is a key link in the chain
    const playerPiece = [...playerPieces].filter(cur => +cur.id === selectedPiece.pieceId)[0] 
    for (let i = 0; i < playerPieces.length; i++){
        if(playerPiece === playerPieces[i] && !off){
            playerPieces[i].style.opacity = 1;
        } else if(!off){
            playerPieces[i].style.opacity = .2;
        } else if(off){
            playerPieces[i].style.opacity = 1;
        }
    }
}

function resetSelectedPieceProps() {
    selectedPiece.pieceId = -1;
    selectedPiece.indexOfBoardPiece = -1;
    selectedPiece.isKing = false;
    selectedPiece.opacity = 1;
    selectedPiece.moveOptions = null;
    selectedPiece.inJumpSequence = false;
}

function getSelectedPiece() {
    selectedPiece.inJumpSequence ? null : selectedPiece.pieceId = parseInt(event.target.id);
    isPieceKing();
}

function isPieceKing() {
    // Call isPieceKing() first when jumping piece
    if (document.getElementById(selectedPiece.pieceId).classList.contains("king")) {
        selectedPiece.isKing = true
    } else {
        selectedPiece.isKing = false
    }
    getBoardData();
}

function getBoardData(refresh) {
    let boardData = [];
    for (let i = 0; i < cells.length; i++) {
      index = boardData.length
      const space = [];
        if (cells[i].classList.contains("noPieceHere") === false) {
            const piece = cells[i].querySelector("p");
            space.push(cells[i]);
            if (piece) {
                space.push(piece)
                if (selectedPiece.pieceId == piece.id ) {
                    // Here we are setting our selectedPieces index on the board
                    selectedPiece.indexOfBoardPiece = i;
                }
            }
        } else {
            space.push(cells[i]);
        }
        boardData.push(space);
    }
    // Saving the current state of the board in our global - remember, these are all references
    board = boardData;
    refresh === "refresh" ? null : getAvailableSpaces(board);
}

function getAvailableSpaces(allSpaces) {
    // True available spaces narrows down the 4 immediate squares surrounding our selected piece
    let trueAvailableSpaces = []

    const pieceIndex = selectedPiece.indexOfBoardPiece;
    // I decided to use the spread operator to create a new array and therefore a new reference to the DOM nodes
    if (allSpaces[pieceIndex + 7] && !allSpaces[pieceIndex + 7][0].classList?.contains("noPieceHere")) {
        trueAvailableSpaces.push([...allSpaces[pieceIndex + 7], "ShortPos", pieceIndex + 7])
    }
    if (allSpaces[pieceIndex - 7] && !allSpaces[pieceIndex - 7][0].classList?.contains("noPieceHere")) {
        trueAvailableSpaces.push([...allSpaces[pieceIndex - 7], "ShortNeg", pieceIndex - 7])
    }
    if (allSpaces[pieceIndex - 9] && !allSpaces[pieceIndex - 9][0].classList?.contains("noPieceHere")) {
        trueAvailableSpaces.push([...allSpaces[pieceIndex - 9], "FarNeg", pieceIndex - 9])
    }
    // Short is a 7 square check & Far is a 9 square check
    if (allSpaces[pieceIndex + 9] && !allSpaces[pieceIndex + 9][0].classList?.contains("noPieceHere")) {
        // Push a "Far" string and that piece index into space
        trueAvailableSpaces.push([...allSpaces[pieceIndex + 9], "FarPos", pieceIndex + 9]);
    }
    // Filter non-kings here
    getDouble(filterOptionsIfNotKing(trueAvailableSpaces));
}

function filterOptionsIfNotKing(options){
    if(!selectedPiece.isKing){
        // Check for redpieces or blackpieces -> determines direction on board
        const farPiece = turn ? "FarNeg" : "FarPos";
        const shortPiece = turn ? "ShortNeg" : "ShortPos";
        return options.filter(cur => !(cur.includes(shortPiece) || cur.includes(farPiece)));
    }
    return options;
}

function getDouble(options) {
    setOpacity();
    lightUpOptions(board, false);
    const opposition = turn ? "blackPiece" : "redPiece";
    const myPieces = turn ? "redPiece" : "blackPiece";
    for (let i = 0; i < options.length; i++) {
            // 1. we are iterating here to check whether our current option (within options) is a black piece... if it is
            // 2. we want to check and see if we can jump over it
            // 3. the point here is we are trying to remove or add options to our "options" array
        if (options[i] && options?.[i].length > 1 && typeof(options[i][1]) != "string" && options[i][1].classList?.contains(opposition)) {
            // Here the idea was to check whether the black piece was in a far position - if was we want to check 9 spaces ahead
            // in order to see if that square was an option - this is essentially gives us a "jump option".
            const shortOrFar = options[i][2];
            if (shortOrFar === "FarNeg" || shortOrFar === "FarPos") {
                // If the length here is 1 then we know the square is empty and ready to be occupied
                const posFarSpace = board?.[options[i]?.[3] + 9]?.length === 1 && shortOrFar === "FarPos" && !board[options[i][3] + 9][0].classList.contains("noPieceHere");
                const negFarSpace = board?.[options[i]?.[3] - 9]?.length === 1 && shortOrFar === "FarNeg" && !board[options[i][3] - 9][0].classList.contains("noPieceHere");
                if (posFarSpace || negFarSpace) {
                    // Push our "jump option" into our options...
                    const square = board[options[i][3] + (posFarSpace ? 9 : -9)];
                    const jumpOption = {}
                    // Turning the square index number into a key and having it equal...
                    jumpOption[options[i][3] + (posFarSpace ? 9 : -9)] = {"jump": square, "enemy": options[i]}
                    options.push(jumpOption);
                }
            } else if (shortOrFar === "ShortNeg" || shortOrFar === "ShortPos"){
                const posFarSpace = board?.[options[i][3] + 7]?.length === 1 && shortOrFar === "ShortPos" && !board[options[i][3] + 7][0].classList.contains("noPieceHere");
                const negFarSpace = board?.[options[i][3] - 7]?.length === 1 && shortOrFar === "ShortNeg" && !board[options[i][3] - 7][0].classList.contains("noPieceHere");
                if(posFarSpace || negFarSpace){
                    // Push our "jump option" into our options...
                    const square = board[options[i][3] + (posFarSpace ? 7 : -7)];
                    const jumpOption = {};
                    // Turning the square index number into a key and having it equal...
                    jumpOption[options[i][3] + (posFarSpace ? 7 : -7)] = {"jump": square, "enemy": options[i]}
                    options.push(jumpOption);
                }
            }
            // Get rid of the black piece that we our evaluating... might want to store this as an option to remove if the player chooses to take it
            options.splice(i,1);
            i--
        }
        if (options[i] && options[i].length > 1 && typeof(options[i][1]) != "string" && options[i][1].classList?.contains(myPieces)) {
            // Here we are removing our pieces from our options
            options.splice(i,1);
            i--;
        }
    }
    // Consolidate information into one object 
    const newOptions = optionsToObj(options);
    selectedPiece.moveOptions = newOptions;
    if(selectedPiece.inJumpSequence){
        const jumpSequenceOptions = stripAllButJumpMoves(newOptions);
        selectedPiece.moveOptions = jumpSequenceOptions;
        if(Object.keys(jumpSequenceOptions).length === 0){
            return endTurn();
        }
        awaitPlayerMove(jumpSequenceOptions);
        lightUpOptions(jumpSequenceOptions, true);
    } else {
        awaitPlayerMove(newOptions);
        lightUpOptions(newOptions, true);
    }
    return newOptions;
}

function stripAllButJumpMoves(options){
    const strippedObj = {};
    for(let option in options){
        if(options[option].jump){
            strippedObj[option] = options[option];
        }
    }
    return strippedObj;
}

function optionsToObj(options){
    // I need to check if there are arrays -> if so these should be move options
    // I need to check if there are objects -> if so these should be jump options

    /**  The object will look something like this -> 
     * 
     *  const arraysToObj = {
     *      28: { move: [td, "Short", 28]},
     *      39: { jump: [td, p#14.blackPiece, "Far", 30]}
     *  }
     * 
    */
    const arraysToObj = options.reduce((acc, cur) => {
        Array.isArray(cur) ? acc[cur[cur.length-1]] = {"move": cur} : acc[Object.keys(cur)[0]] = cur[Object.keys(cur)[0]]; 
        return acc;
    },{});
    return arraysToObj;
}

function awaitPlayerMove(options){
    // add event listeners to pieces
    Object.keys(options).forEach(key => {
        board[key][0].addEventListener("click", userMove);
    })
}

function lightUpOptions(options, addOrRemove){
    if(addOrRemove && !Array.isArray(options)){
        for(let moveOption in options){
            const reference = options[moveOption].move || options[moveOption].jump;
            if(reference && addOrRemove){
                reference[0].classList.add("moveOption");
            } else if(reference && !addOrRemove){
                reference[0].classList.remove("moveOption");
            }
        }
    } else if(!addOrRemove && Array.isArray(options)){
        options.forEach(cur => cur[0].classList.remove("moveOption"));
    }
}

function userMove(e){
    // we need to iterate over our selectedPiece.moveOptions obj and see if our e.target is there
    // Get the enemy piece number from data
    // Data looks like -> {39: {enemy: [td, p#14.blackPiece, "Far", 30], jump: [td.moveOption]}} ?
    let enemy = null;
    let moveOption = null;
    let jumpOption = null;
    // Here we have access to all of the move options of the current piece
    const data = selectedPiece.moveOptions;
    for(let key in data){
        if(data[key].jump || data[key].move){
            const jump = data[key]?.jump?.[0];
            const move = data[key]?.move?.[0];
            // Checks if the move option is either a jump move or a regular move
            jump === e.target ? jumpOption = jump : move === e.target ? moveOption = move : null;
        }
        if(data[key].enemy){
            enemy = data[key].enemy[0];
        }
    }
    // If enemy, remove enemy piece from board
    if(enemy && jumpOption){
        // Removes opponents piece from space -> user takes
        enemy.removeChild(enemy.childNodes[0]);
    }
    // Move player piece - using selected piece info
    if(jumpOption || moveOption){
        const filteredMove = jumpOption || moveOption;
        const [, userPiece] = board[selectedPiece.indexOfBoardPiece];
        filteredMove.classList.remove("moveOption");
        filteredMove.appendChild(userPiece);
        // If a jump is made we need to allow for the possibility of another turn
    }
    return jumpOption ? endTurn("Jumped") : endTurn();
}

function endTurn(jumped = false){
    const data = selectedPiece.moveOptions;
    getBoardData("refresh");
    kingMe();
    removeMoveListeners(data);
    lightUpOptions(board, false);
    setOpacity(true);
    if(!jumped){
        resetSelectedPieceProps();
        turn = !turn;
        selectedPiece.inJumpSequence = false;
        switchTurnsCSS(turn);
    } else {
        selectedPiece.inJumpSequence = true;
    }
    redPieces = document.querySelectorAll(".redPiece");
    blackPieces = document.querySelectorAll(".blackPiece");
    checkForWin();
    giveListeners();
    
}

function checkForWin(){
    if(redPieces.length === 0){
        console.log("Black Wins!")
    } else if (blackPieces.length === 0){
        console.log("Red Wins!")
    }
}

function kingMe(){
    const playerPiece = turn ? "redPiece" : "blackPiece";
    const side = turn ? 56 : 0;
    for(let i = side; i < (turn ? board.length : 8); i++){
        if(board[i].length > 1){
            const endSquare = Array.from(board[i][1].classList)
            if(endSquare.includes(playerPiece) && !endSquare.includes("king")){
                board[i][1].classList.add("king");
            }
        }
    }
    
}

function switchTurnsCSS(turn){
    if(turn){
        redTurn.classList.remove("notTurn");
        blackTurn.classList.add("notTurn");
    } else {
        blackTurn.classList.remove("notTurn");
        redTurn.classList.add("notTurn");
    }
}

function removeMoveListeners(data){
    for(let option in data){
        board[option][0].removeEventListener("click", userMove);
    }
}