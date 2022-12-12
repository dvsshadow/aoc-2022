import { processLineByLine } from "../utils.js";

function mapData(lines) {
    return lines.map(line => line.split(""));
}

function getStartCoordinates(grid) {
    const ROWS = grid.length;
    const COLS = grid[0].length;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] === "S") {
                return [r, c];
            }
        }
    }
}

function reduceData(grid) {
    const ROWS = grid.length;
    const COLS = grid[0].length;
    const OFFSETS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    const points = new Array(ROWS).fill([]).map(_ => new Array(COLS));
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] === "S") {
                points[r][c] = 1;
            } else if (grid[r][c] === "E") {
                points[r][c] = 26;
            } else {
                points[r][c] = grid[r][c].charCodeAt(0) - 'a'.charCodeAt(0) + 1;
            }
        }
    }

    function getShortestPath(startR, startC) {
        const visited = new Set();
        const bfsQueue = [];
        bfsQueue.push([startR, startC, 0]);

        while(bfsQueue.length > 0) {
            const [r, c, d] = bfsQueue.shift();
            if (visited.has(`${r}|${c}`)) {
                continue;
            }
            visited.add(`${r}|${c}`);
            if (grid[r][c] === "E") {
                return d;
            }
            for (const o of OFFSETS) {
                const nr = r + o[0];
                const nc = c + o[1];
                if (0 <= nr && nr < ROWS && 0 <= nc && nc < COLS && points[nr][nc] <= (1 + points[r][c])) {
                    bfsQueue.push([nr, nc, d + 1]);
                }
            }
        }

        return -1;
    }

    const startPoints = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if(points[r][c] === 1) {
                startPoints.push([r, c]);
            }
        }
    }

    let minSteps = Number.MAX_SAFE_INTEGER;
    for (const startPoint of startPoints) {
        const [sr, sc] = startPoint;
        const shortestPath = getShortestPath(sr, sc);
        if (shortestPath !== -1 && shortestPath < minSteps) {
            minSteps = shortestPath;
        }
    }
    return minSteps;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const grid = mapData(lines);
    const result = reduceData(grid);
    console.log(result);
}

solve();