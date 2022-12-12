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

    const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    const allOffsets = [...offsets, ...diagonals];
    const tails = new Array(9).fill([]).map(_ => {
        return {
            x: 0,
            y: 0,
            visited: new Set()
        };
    })

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

    function isSurroundingCell(x, y, next) {
        if (next.x === x && next.y === y) {
            return true;
        }
        for (const o of allOffsets) {
            if (x === next.x + o[0] && y === next.y + o[1]) {
                return true;
            }
        }
        return false;
    }

    function moveTail(current, next) {
        const setKey = `${current.x}|${current.y}`;
        current.visited.add(setKey);

        if (isSurroundingCell(current.x, current.y, next)) {
            return;
        }

        for (const o of offsets) {
            const nextX = current.x + (o[0] * 2);
            const nextY = current.y + (o[1] * 2);
            if (next.x === nextX && next.y === nextY) {
                current.x = current.x + o[0];
                current.y = current.y + o[1];
                return;
            }
        }

        for (const d of diagonals) {
            const nextX = current.x + d[0];
            const nextY = current.y + d[1];
            if (isSurroundingCell(nextX, nextY, next)) {
                current.x = nextX;
                current.y = nextY;
                return;
            }
        }
    }

    function moveTails() {
        for (let i = 1; i < tails.length; i++) {
            const next = tails[i - 1];
            const current = tails[i];
            moveTail(current, next);
        }
    }

    for (const mov of movements) {
        for (let i = 0; i < mov.value; i++) {
            moveHead(mov);
            moveTail(tails[0], head);
            moveTails();
        }
    }
    moveTails();
    return tails[tails.length - 1].visited.size;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const movements = mapData(lines);
    const result = reduceData(movements);
    console.log(result);
}

solve();