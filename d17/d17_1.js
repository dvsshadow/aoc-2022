import {processLineByLine} from "../utils.js";

const TOTAL_ROCKS = 2022;
const ROCKS_LENGTH = 5;

function mapData(lines) {
    return lines[0].split("");
}

class ObjectSet extends Set{
    add(elem){
        return super.add(typeof elem === 'object' ? JSON.stringify(elem) : elem);
    }
    has(elem){
        return super.has(typeof elem === 'object' ? JSON.stringify(elem) : elem);
    }
}

// set of x y pairs
function getPiece(piece, y) {
    if (piece === 0) {
        return new ObjectSet([[2, y], [3, y], [4, y], [5, y]]);
    } else if (piece === 1) {
        return new ObjectSet([[3, y + 2], [2, y + 1], [3, y + 1], [4, y + 1], [3, y]]);
    } else if (piece === 2) {
        return new ObjectSet([[2, y], [3, y], [4, y], [4, y + 1], [4, y + 2]]);
    } else if (piece === 3) {
        return new ObjectSet([[2, y], [2, y + 1], [2, y + 2], [2, y + 3]]);
    } else if (piece === 4) {
        return new ObjectSet([[2, y], [2, y + 1], [3, y], [3, y + 1]]);
    }
}

function moveLeft(piece) {
    for (const pieceJson of piece) {
        const [x, y] = JSON.parse(pieceJson);
        if (x === 0) {
            return piece;
        }
    }
    const toReturn = new ObjectSet();
    for (const pieceJson of piece) {
        const [x, y] = JSON.parse(pieceJson);
        toReturn.add([x - 1, y]);
    }
    return toReturn;
}

function moveRight(piece) {
    for (const pieceJson of piece) {
        const [x, y] = JSON.parse(pieceJson);
        if (x === WIDTH - 1) {
            return piece;
        }
    }
    const toReturn = new ObjectSet();
    for (const pieceJson of piece) {
        const [x, y] = JSON.parse(pieceJson);
        toReturn.add([x + 1, y]);
    }
    return toReturn;
}

function moveDown(piece) {
    const toReturn = new ObjectSet();
    for (const pieceJson of piece) {
        const [x, y] = JSON.parse(pieceJson);
        toReturn.add([x, y - 1]);
    }
    return toReturn;
}

function moveUp(piece) {
    const toReturn = new ObjectSet();
    for (const pieceJson of piece) {
        const [x, y] = JSON.parse(pieceJson);
        toReturn.add([x, y + 1]);
    }
    return toReturn;
}

function setIntersection(set1, set2) {
    const intersection = new ObjectSet(
        [...set1].filter(elem => set2.has(elem))
    );

    return intersection;
}

function getTopY(rocks) {
    let topY = 0;
    for (const rockJson of rocks) {
        const [x, y] = JSON.parse(rockJson);
        topY = Math.max(topY, y);
    }
    return topY;
}

function reduceData(jetPatterns) {
    let rockIdx = 0;
    let jetIdx = 0;

    function getNextPiece() {
        const toReturn = rockIdx % ROCKS_LENGTH;
        rockIdx += 1;
        return toReturn;
    }

    function getNextJet() {
        const toReturn = jetPatterns[jetIdx % jetPatterns.length];
        jetIdx += 1;
        return toReturn;
    }

    const rocks = new ObjectSet();
    for (let x = 0; x < WIDTH; x++) {
        rocks.add([x, 0]);
    }

    let topY = 0;
    for (let r = 0; r < TOTAL_ROCKS; r++) {
        let piece = getPiece(getNextPiece(), topY + 4);
        while (true) {
            const jet = getNextJet();
            if (jet === "<") {
                piece = moveLeft(piece);
                // we can't do the move like this
                if (setIntersection(rocks, piece).size > 0) {
                    piece = moveRight(piece);
                }
            } else {
                piece = moveRight(piece);
                if (setIntersection(rocks, piece).size > 0) {
                    piece = moveLeft(piece);
                }
            }
            piece = moveDown(piece);
            if (setIntersection(rocks, piece).size > 0) {
                piece = moveUp(piece);
                for (const pieceJson of piece) {
                    rocks.add(JSON.parse(pieceJson));
                }
                topY = getTopY(rocks);
                break;
            }
        }
    }
    return topY;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const jetPatterns = mapData(lines);
    const result = reduceData(jetPatterns);
    console.log(result);
}

solve();