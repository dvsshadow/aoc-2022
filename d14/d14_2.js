import { processLineByLine } from "../utils.js";

const ROWS = 200;
const COLS = 1000;
const START_COL = 500;

function addLineRocksToCave(line, cave) {
    const splitLines = line.split(" -> ");
    let highestRow = 0;
    for (let i = 0; i < splitLines.length - 1; i++) {
        const [startC, startR] = splitLines[i].split(",").map(number => parseInt(number));
        const [endC, endR] = splitLines[i + 1].split(",").map(number => parseInt(number));
        highestRow = Math.max(highestRow, Math.max(startR, endR));
        // find anchor (row or col)
        if (startR === endR) {
            const minC = Math.min(startC, endC);
            const maxC = Math.max(startC, endC);
            for (let c = minC; c <= maxC; c++) {
                cave[startR][c] = "#";
            }
        } else if (startC === endC) {
            const minR = Math.min(startR, endR);
            const maxR = Math.max(startR, endR);
            for (let r = minR; r <= maxR; r++) {
                cave[r][startC] = "#";
            }
        }
    }
    return highestRow;
}

function mapData(lines) {
    const cave = new Array(ROWS).fill([]).map(_ => new Array(COLS).fill("."));
    let highestRow = 0;
    for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        highestRow = Math.max(highestRow, addLineRocksToCave(line, cave));
    }
    for (let c = 0; c < COLS; c++) {
        cave[highestRow + 2][c] = "#";
    }
    return cave;
}

function isStuckAtTop(grain, cave) {
    return !canMove(grain, cave) && grain[0] === 0 && grain[1] === START_COL;
}

function canMove(grain, cave) {
    const [r, c] = grain;
    return cave[r + 1][c] === "." ||
        cave[r + 1][c + 1] === "." ||
        cave[r + 1][c - 1] === ".";
}

function moveGrain(grain, cave) {
    const [r, c] = grain;
    if (cave[r + 1][c] === ".") {
        grain[0] = grain[0] + 1;
    } else if (cave[r + 1][c - 1] === ".") {
        grain[0] = grain[0] + 1;
        grain[1] = grain[1] - 1;
    } else if (cave[r + 1][c + 1] === ".") {
        grain[0] = grain[0] + 1;
        grain[1] = grain[1] + 1;
    }
}

function reduceData(cave) {
    let currentGrain = [0, START_COL];
    const grains = [];
    while (!isStuckAtTop(currentGrain, cave)) {
        if (!canMove(currentGrain, cave)) {
            grains.push(currentGrain);
            const [r, c] = currentGrain;
            cave[r][c] = "o";
            currentGrain = [0, START_COL];
            continue;
        }
        moveGrain(currentGrain, cave);
    }
    // +1 for the top grain
    return grains.length + 1;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const cave = mapData(lines);
    const result = reduceData(cave);
    console.log(result);
}

solve();