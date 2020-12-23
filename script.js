let board = []

// const board = [
//     null, 0, null, 1, null, 2, null, 3, 
//     4, null, 5, null, 6, null, 7, null,
//     null, 8, null, 9, null, 10, null, 11,
//     true, null, true, null, true, null, true, null,
//     null, true, null, true, null, true, null, true,
//     12, null, 13, null, 14, null, 15, null,
//     null, 16, null, 17, null, 18, null, 19,
//     20, null, 21, null, 22, null, 23, null,
// ]

const cells = document.querySelectorAll("td")
let redPieces = document.querySelectorAll(".redPiece")
let blackPieces = document.querySelectorAll(".blackPiece")
const divider = document.getElementById("divider")

let redScore = 12
let blackScore = 12
let turn = true
let playerPieces

let selectedPiece = {
    pieceId: -1,
    indexOfBoardPiece: -1,
    isKing: false,
    seventhSpace: false,
    ninthSpace: false,
    fourteenthSpace: false,
    eighteenthSpace: false,
    minusSeventhSpace: false,
    minusNinthSpace: false,
    minusFourteenthSpace: false,
    minusEighteenthSpace: false,
    opacity: 1, 
    moveOptions: null
}



const giveListeners = () => {
    if (turn) {
        // console.log(blackPieces, "here")
        for(let i = 0; i < blackPieces.length; i++){
            console.log(blackPieces.length, "blackpieces removed")
            blackPieces[i].removeEventListener("click", getPlayerPieces);
        }
        for (let i = 0; i < redPieces.length; i++) {
            redPieces[i].addEventListener("click", getPlayerPieces)
        }
    } else {
        for(let i = 0; i < redPieces.length; i++){
            console.log(redPieces.length, "redPieces removed")

            redPieces[i].removeEventListener("click", getPlayerPieces);
        }
        for (let i = 0; i < blackPieces.length; i++) {
            blackPieces[i].addEventListener("click", getPlayerPieces)    
        }
    }
}
giveListeners()
// Is there hoisting in ES6 syntax? If so, how do you write a function in ES6 that allows
// for hoisting? And if not, why is there no hoisting? Step down rule
function getPlayerPieces() {
    if (turn) {
        playerPieces = redPieces

    } else {
        playerPieces = blackPieces
    }
    removeCellOnClick()
    setOpacity()
}
function removeCellOnClick() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick")  
    }
}
function setOpacity(off = false) {
    if(!off) getSelectedPiece()
    for (let i = 0; i < playerPieces.length; i++) {
        if([...playerPieces].filter(cur => +cur.id === selectedPiece.pieceId)[0] === playerPieces[i] && !off){
            playerPieces[i].style.opacity = 1;
        } else if(!off){
            playerPieces[i].style.opacity = .2;
        } else if(off){
            playerPieces[i].style.opacity = 1;
        }
    }
    // resetSelectedPieceProps()
}
function resetSelectedPieceProps() {
    selectedPiece.pieceId = -1;
    selectedPiece.indexOfBoardPiece = -1;
    selectedPiece.isKing = false;
    selectedPiece.seventhSpace = false;
    selectedPiece.ninthSpace = false;
    selectedPiece.fourteenthSpace = false;
    selectedPiece.eighteenthSpace = false;
    selectedPiece.minusSeventhSpace = false;
    selectedPiece.minusNinthSpace = false;
    selectedPiece.minusFourteenthSpace = false;
    selectedPiece.minusEighteenthSpace = false;
    selectedPiece.opacity = 1;
}
function getSelectedPiece() {
    selectedPiece.pieceId = parseInt(event.target.id)
    // console.log(selectedPiece.pieceId, "piece id")
    isPieceKing()
}
function isPieceKing() {
    if (document.getElementById(selectedPiece.pieceId).classList.contains("king")) {
        selectedPiece.isKing = true
    } else {
        selectedPiece.isKing = false
    }
    getAvailableSpaces()
}
function getAvailableSpaces() {
    let potentialSpaces = []
    for (let i = 0; i < cells.length; i++) {
      index = potentialSpaces.length
      const space = []
        if (cells[i].classList.contains("noPieceHere") == false) {
            const piece = cells[i].querySelector("p")
            space.push(cells[i])
            if (piece) {
                space.push(piece)
                if (selectedPiece.pieceId == piece.id ) {
                    selectedPiece.indexOfBoardPiece = i;
                }
            }
        } else {
            space.push(cells[i])
        }
        potentialSpaces.push(space)
    }
    // console.log(potentialSpaces, "potential spaces")
    // console.log(potentialSpaces, "potential spaces")
    getRealAvailableSpaces(potentialSpaces)
}
function getRealAvailableSpaces(allSpaces) {
    // True available spaces narrows down the 4 immediate squares surrounding our selected piece
    let trueAvailableSpaces = []
    // Saving the current state of the board
    board = allSpaces
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
    // console.log(trueAvailableSpaces, "true")
    // if(turn){
    getDouble(trueAvailableSpaces)
    // }
}
function getDouble(options) {
    lightUpOptions(board, false);
    // console.log(options, "options")
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
                const posFarSpace = board?.[options[i]?.[3] + 9].length === 1 && shortOrFar === "FarPos";
                const negFarSpace = board?.[options[i]?.[3] - 9].length === 1 && shortOrFar === "FarNeg";
                if (posFarSpace || negFarSpace) {
                    // Push our "jump option" into our options...
                    const square = board[options[i][3] + (posFarSpace ? 9 : -9)];
                    const jumpOption = {}
                    // Turning the square index number into a key and having it equal...
                    jumpOption[options[i][3] + (posFarSpace ? 9 : -9)] = {"jump": square, "enemy": options[i]}
                    options.push(jumpOption);
                }
            } else if (shortOrFar === "ShortNeg" || shortOrFar === "ShortPos"){
                const posFarSpace = board[options[i][3] + 7].length === 1 && shortOrFar === "ShortPos";
                const negFarSpace = board[options[i][3] - 7].length === 1 && shortOrFar === "ShortNeg";
                if(posFarSpace || negFarSpace){
                    // Push our "jump option" into our options...
                    const square = board[options[i][3] + (posFarSpace ? 7 : -7)];
                    const jumpOption = {}
                    // Turning the square index number into a key and having it equal...
                    jumpOption[options[i][3] + (posFarSpace ? 7 : -7)] = {"jump": square, "enemy": options[i]}
                    options.push(jumpOption);
                }
            }
            // Get rid of the black piece that we our evaluating... might want to store this as an option to remove if the player chooses to take it
            options.splice(i,1);
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
    awaitPlayerMove(selectedPiece.moveOptions);
    lightUpOptions(newOptions, true);
    return newOptions;
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

function awaitPlayerMove(options){
    // add event listeners to pieces
    Object.keys(options).forEach(key => {
        board[key][0].addEventListener("click", userMove);
    })
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
            // console.log(data[key], "keys")
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
        // Remove event listener after use
        (selectedPiece.moveOptions, "<-- move options")
    }
    endTurn();
}

function endTurn(){
    const data = selectedPiece.moveOptions;
    function removeListeners(){
        for(let option in data){
            board[option][0].removeEventListener("click", userMove);
        }
    }
    removeListeners();
    lightUpOptions(board, false);
    setOpacity(true);
    resetSelectedPieceProps();
    turn = !turn;
    giveListeners();
}