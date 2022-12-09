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

    function getScenicScore(r, c) {
        const currentTree = trees[r][c];
        let topScore = 0;
        for (let newR = r - 1; newR >= 0; --newR) {
            topScore += 1;
            if (trees[newR][c] >= currentTree) {
                break;
            }
        }
        let downScore = 0;
        for (let newR = r + 1; newR < ROWS; ++newR) {
            downScore += 1;
            if (trees[newR][c] >= currentTree) {
                break;
            }
        }
        let leftScore = 0;
        for (let newC = c - 1; newC >= 0; --newC) {
            leftScore += 1;
            if (trees[r][newC] >= currentTree) {
                break;
            }
        }
        let rightScore = 0;
        for (let newC = c + 1; newC < COLS; ++newC) {
            rightScore += 1;
            if (trees[r][newC] >= currentTree) {
                break;
            }
        }
        return topScore * downScore * leftScore * rightScore;
    }


    let maxScenicScore = 0;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            maxScenicScore = Math.max(maxScenicScore, getScenicScore(r, c));
        }
    }

    return maxScenicScore;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const trees = mapData(lines);
    const result = reduceData(trees);
    console.log(result);
}

solve();