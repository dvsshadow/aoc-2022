import { processLineByLine } from "../utils.js";

const WINDOW_SIZE = 14;

function mapData(lines) {
    return lines[0];
}

function reduceData(line) {
    for (let i = 0; i < line.length - WINDOW_SIZE; ++i) {
        const currentCharacters = line.slice(i, i + WINDOW_SIZE);
        const charSet = new Set(currentCharacters);
        if (charSet.size === WINDOW_SIZE) {
            return i + WINDOW_SIZE;
        }
    }
}


async function solve() {
    const lines = await processLineByLine("input.txt");
    const line = mapData(lines);
    const result = reduceData(line);
    console.log(result);
}

solve();
