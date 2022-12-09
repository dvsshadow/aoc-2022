import { processLineByLine } from "../utils.js";

function mapData(lines) {
    return lines
        .map(line => line
                .split("")
                .map(n => parseInt(n)
            )
        );
}

function reduceData(trees) {
    const ROWS = trees.length;
    const COLS = trees[0].length;

    function isVisible(r, c) {
        if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
            return true;
        }
        const currentTree = trees[r][c];
        let isVisibleTop = true;
        for (let newR = r - 1; newR >= 0; --newR) {
            if (trees[newR][c] >= currentTree) {
               isVisibleTop = false;
               break;
            }
        }
        let isVisibleDown = true;
        for (let newR = r + 1; newR < ROWS; ++newR) {
            if (trees[newR][c] >= currentTree) {
               isVisibleDown = false;
               break;
            }
        }
        let isVisibleLeft = true;
        for (let newC = c - 1; newC >= 0; --newC) {
            if (trees[r][newC] >= currentTree) {
                isVisibleLeft = false;
                break;
            }
        }
        let isVisibleRight = true;
        for (let newC = c + 1; newC < COLS; ++newC) {
            if (trees[r][newC] >= currentTree) {
                isVisibleRight = false;
                break;
            }
        }
        return isVisibleRight || isVisibleLeft || isVisibleTop || isVisibleDown;
    }


    let visible = 0;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (isVisible(r, c)) {
                visible += 1;
            }
        }
    }

    return visible;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const trees = mapData(lines);
    const result = reduceData(trees);
    console.log(result);
}

solve();