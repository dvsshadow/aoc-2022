import { processLineByLine } from "../utils.js";

function mapData(lines) {
    return lines.map(s => {
        return {
            direction: s.split(" ")[0],
            value: parseInt(s.split(" ")[1])
        };
    });
}

function reduceData(movements) {
    let head = {
        x: 0,
        y: 0
    };
    let tail = {
        x: 0,
        y: 0
    };

    const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    const allOffsets = [...offsets, ...diagonals];

    function moveHead(mov) {
        if (mov.direction === "R") {
            head.x += 1;
        } else if (mov.direction === "L") {
            head.x -= 1;
        } else if (mov.direction === "U") {
            head.y += 1;
        } else if (mov.direction === "D") {
            head.y -= 1;
        }
    }

    function isSurroundingHead(x, y) {
        if (head.x === x && head.y === y) {
            return true;
        }
        for (const o of allOffsets) {
            if (x === head.x + o[0] && y === head.y + o[1]) {
                return true;
            }
        }
        return false;
    }

    function moveTail() {
        const setKey = `${tail.x}|${tail.y}`;
        tailVisited.add(setKey);

        if (isSurroundingHead(tail.x, tail.y)) {
            return;
        }

        for (const o of offsets) {
            const nextX = tail.x + (o[0] * 2);
            const nextY = tail.y + (o[1] * 2);
            if (head.x === nextX && head.y === nextY) {
                tail.x = tail.x + o[0];
                tail.y = tail.y + o[1];
                return;
            }
        }

        for (const d of diagonals) {
            const nextX = tail.x + d[0];
            const nextY = tail.y + d[1];
            if (isSurroundingHead(nextX, nextY)) {
                tail.x = nextX;
                tail.y = nextY;
                return;
            }
        }
    }

    const tailVisited = new Set();
    for (const mov of movements) {
        for (let i = 0; i < mov.value; i++) {
            moveHead(mov);
            moveTail();
        }
    }
    moveTail();
    return tailVisited.size;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const movements = mapData(lines);
    const result = reduceData(movements);
    console.log(result);
}

solve();