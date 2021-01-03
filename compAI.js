/* ALL OF THIS BELOW CAN BE CONSIDERED PSEUDOCODE */
/////////////////////////////////////////////////////

// SIDE NOTE: consider turning board / game / piece into classes

// Functions to consider

// Gives us our score
function evaluateBoard(){

}

// Self Explanatory
function getAllPlayerMoves(position, color, game){
    // get all the possible moves from the current postion (19:13)

    // moves looks like... [[board, piece], [newBoard, piece]]...
    const moves = [];
    for(let piece in board.getAllPieces('color')){
        // ValidMoves is an object and looks like... (20:00)
        let validMoves = board.getValidMoves(piece);
        for(let move in validMoves.items()){
            let tempBoard = deepCopy(board);
            // If you make this move, the new board will look like this...
            let newBoard = simulateMove(piece, move, tempBoard, game, skip);
            // From: moves.push([newBoard, piece]); To (25:30):
            moves.push(newBoard);
            // We will then score this board within minMax
        }
    }
    return moves;
}

function simulateMove(piece, move, board, game, skip){
    // In this example move[0] is the "row" and move[1] is the "column"
    // WE CAN CHANGE THIS GIVEN OUR DEFINED MOVE FUNCTION
    board.move(piece, move[0], move[1]);
    if(skip){
        board.remove(skip);
    }
    return board;
}

function minMax(postion, depth, maxPlayer, game){
    /* THIS IS A RECURSIVE FUNCTION

    /* position -> our current position === our board object
        based on this board give me the best possible board after this
        that I should move into as the white/red player
    */

    /* depth -> how far am I making this tree? */

    /* maxPlayer -> boolean -> are we minizing / maximizing? 
        we can essentially have two computers play against each other
    */

    /* game -> optional for visualization */

    /* we only make an evaluation at the last node of branch */
    if(depth === 0 || position.winner() !== null){
        // If we've won the game the game is over, no need to continue 
        // evaluating
        return [position.evaluate(), position]
    }

    if(maxPlayer){
        // -infinity is the lowest possible score
        let maxEval = -Infinity;
        let bestMove = null;
        for(let move in getAllPlayerMoves(position, "red", game)){
            // returns [postion, board] -> [0] this gives us a number??
            let evaluation = minMax(move, depth-1, false, game)[0];
            maxEval = max(maxEval, evaluation);
            if(maxEval === evaluation){
                bestMove = move;
            }
        }
        return [maxEval, bestMove]
    } else {
         // -infinity is the lowest possible score
         let maxEval = Infinity;
         let bestMove = null;
         for(let move in getAllPlayerMoves(position, "black", game)){
             // returns [postion, board] -> [0] this gives us a number??
             let evaluation = minMax(move, depth-1, true, game)[0];
             maxEval = max(maxEval, evaluation);
             if(maxEval === evaluation){
                 bestMove = move;
             }
         }
         return [maxEval, bestMove]
    }
}