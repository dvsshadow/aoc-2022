import {processLineByLine} from "../utils.js";

const TOTAL_ROCKS = 1000000000000;
const ROCKS_LENGTH = 5;
const SIGNATURE_SIZE = 1000;

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

function getSignature(rocks) {
    const topY = getTopY(rocks);
    const signature = new ObjectSet();
    for (const rockJson of rocks) {
        const [x, y] = JSON.parse(rockJson);
        const deltaY = topY - y;
        if (deltaY <= SIGNATURE_SIZE) {
            signature.add([x, deltaY]);
        }
    }
    return signature;
}

function reduceData(jetPatterns) {
    let pieceIdx = 0;
    let jetIdx = 0;
    let added = 0;

    function getNextPiece(r) {
        return r % ROCKS_LENGTH;
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
    const seenFormations = new Map();

    let topY = 0;
    for (let r = 0; r < TOTAL_ROCKS; r++) {
        let piece = getPiece(getNextPiece(r), topY + 4);
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

                const signature = getSignature(rocks);
                const formation = JSON.stringify([jetIdx % jetPatterns.length, pieceIdx, [...signature]]);
                if (seenFormations.has(formation)) {
                    const [oldRock, oldTopY] = JSON.parse(seenFormations.get(formation));
                    const deltaY = topY - oldTopY;
                    const deltaRocks = r - oldRock;
                    const amount = Math.round((TOTAL_ROCKS - r) / deltaRocks);
                    added += amount * deltaY;
                    r += amount * deltaY;
                }
                seenFormations.set(formation, JSON.stringify([r, topY]))
                break;
            }
        }
    }
    return topY + added;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const jetPatterns = mapData(lines);
    const result = reduceData(jetPatterns);
    console.log(result);
}

solve();