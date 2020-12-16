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
let pieceIndex = 0

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
}


const giveListeners = () => {
    if (turn) {
        for (let i = 0; i < redPieces.length; i++) {
            redPieces[i].addEventListener("click", getPlayerPieces)
        }
    } else {
        for (let i = 0; i < blackPieces.length; i++) {
            blackPieces[i].addEventListener("click", () => {
                console.log("click")
            })    
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
    resetOpacity()
}
function removeCellOnClick() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick")
        
    }
}
function resetOpacity() {
    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.opacity = .2;
        
    }
    resetSelectedPieceProps()
    getSelectedPiece()
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
    console.log(event)
    selectedPiece.pieceId = parseInt(event.target.id)
    selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId)
    playerPieces[selectedPiece.pieceId].style.opacity = 1
    console.log(selectedPiece.indexOfBoardPiece)
    isPieceKing()
}
function findPiece(pieceId) {
    let parsed = parseInt(pieceId)
    return board.indexOf(parsed)
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
    let index = 0
    for (let i = 0; i < cells.length; i++) {
      index = potentialSpaces.length
      const space = []
        if (cells[i].classList.contains("noPieceHere") == false) {
            const piece = cells[i].querySelector("p")
            space.push(cells[i])
            if (piece) {
                space.push(piece)
                if (selectedPiece.pieceId == piece.id ) {
                    pieceIndex = i
                }
            }
        } else {
            space.push(cells[i])
        }
        potentialSpaces.push(space)
    }
    // console.log(potentialSpaces, "potential spaces")
    getRealAvailableSpaces(potentialSpaces)
}
function getRealAvailableSpaces(allSpaces) {
    // True available spaces narrows down the 4 immediate squares surrounding our selected piece
    let trueAvailableSpaces = []
    board = allSpaces
    if (pieceIndex < 9) {
        if (allSpaces[pieceIndex + 9] && !allSpaces[pieceIndex + 9][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex + 9])
        }
        if (allSpaces[pieceIndex + 7] && !allSpaces[pieceIndex + 7][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex + 7])
        } 
    } else if (pieceIndex == 9) {
        if (allSpaces[pieceIndex + 9] && !allSpaces[pieceIndex + 9][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex + 9])
        }
        if (allSpaces[pieceIndex + 7] && !allSpaces[pieceIndex + 7][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex + 7])
        }
        if (allSpaces[pieceIndex - 7] && !allSpaces[pieceIndex - 7][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex - 7])
        }
    } else if (pieceIndex > 55) {
        if (allSpaces[pieceIndex - 7] && !allSpaces[pieceIndex - 7][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex - 7])
        }
        if (allSpaces[pieceIndex - 9] && !allSpaces[pieceIndex - 9][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex - 9])
        }
    } else if (pieceIndex == 55) {
        if (allSpaces[pieceIndex + 7] && !allSpaces[pieceIndex + 7][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex + 7])
        }
        if (allSpaces[pieceIndex - 7] && !allSpaces[pieceIndex - 7][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex - 7])
        }
        if (allSpaces[pieceIndex - 9] && !allSpaces[pieceIndex - 9][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex - 9])
        }
    } else {
        // Short is a 7 square check & Far is a 9 square check
        if (allSpaces[pieceIndex + 9] && !allSpaces[pieceIndex + 9][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex + 9])
            trueAvailableSpaces[0].push("Far")
            trueAvailableSpaces[0].push(pieceIndex + 9)
        }
        if (allSpaces[pieceIndex + 7] && !allSpaces[pieceIndex + 7][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex + 7])

            if(trueAvailableSpaces[1]){
                trueAvailableSpaces[1].push("Short")
                trueAvailableSpaces[1].push(pieceIndex + 7)
            }
        }
        if (allSpaces[pieceIndex - 7] && !allSpaces[pieceIndex - 7][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex - 7])
            trueAvailableSpaces[2].push("Short")
            trueAvailableSpaces[2].push(pieceIndex - 7)
        }
        if (allSpaces[pieceIndex - 9] && !allSpaces[pieceIndex - 9][0].classList.contains("noPieceHere")) {
            trueAvailableSpaces.push(allSpaces[pieceIndex - 9])

            if(trueAvailableSpaces[3]){
                trueAvailableSpaces[3].push("Far")
                trueAvailableSpaces[3].push(pieceIndex - 9)
            }
        }
    }
    console.log(trueAvailableSpaces, "at the end")
    // console.log(trueAvailableSpaces, "true available spaces")
    getDouble(trueAvailableSpaces)
}
function getDouble(options) {
    //  if (turn) {
        lightUpOptions(board, false);
        const opposition = turn ? "blackPiece" : "redPiece";
        const myPieces = turn ? "redPiece" : "blackPiece";
         for (let i = 0; i < options.length; i++) {
             // 1. we are iterating here to check whether our current option (within options) is a black piece... if it is
             // 2. we want to check and see if we can jump over it
             // 3. the point here is we are trying to remove or add options to our "options" array
             if (options[i] && options?.[i].length > 1 && typeof(options[i][1]) != "string" && options[i][1].classList.contains(opposition)) {
                // Here the idea was to check whether the black piece was in a far position - if was we want to check 9 spaces ahead
                // in order to see if that square was an option - this is essentially gives us a "jump option".
                
                if ((options[i][2]) == "Far") {
                    if (board?.[options[i]?.[3] + 9].length === 1) {
                        // Push our "jump option" into our options...
                        options.push({"jump": board[options[i][3] + 9], "enemy": options[i]});
                    }
                } else if (options[i][2] == "Short"){
                    if(board?.[options[i]?.[3] + 7].length === 1){
                        // Push our "jump option" into our options...
                        options.push({"jump": board[options[i][3] + 7], "enemy": options[i]});
                    }
                }
                const holdVal = options[i]
                // Get rid of the black piece that we our evaluating... might want to store this as an option to remove if the player chooses to take it
                console.log(holdVal, "holdVal")
                options.splice(i,1);
            }

            if (options[i] && options[i].length > 1 && typeof(options[i][1]) != "string" && options[i][1].classList.contains(myPieces)) {
                // Here we are removing our pieces from our options
                options.splice(i,1);
                i--;
            }
         }
         console.log(options)
         lightUpOptions(options, true);  
    return options;
}

function lightUpOptions(options, addOrRemove){
    for(let i = 0; i < options.length; i++){
        // Add class to squares
        if(options[i]?.jump){
            console.log(options[i].jump[0], "here")
            options[i].jump[0].classList.add("moveOption");
        } else {
            if(addOrRemove){
                options[i][0].classList.add("moveOption");
            } else {
                options[i][0].classList.remove("moveOption");
            }
        }
    }
}
 //double the value of the checked space's index if the space is occupied, and check the new value for vacancy.