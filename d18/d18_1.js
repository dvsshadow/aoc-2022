import {processLineByLine} from "../utils.js";

const offsets = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1]
]

function mapData(lines) {
    const cubeSet = new Set();
    for (const line of lines) {
        const [x, y, z] = line.split(",");
        cubeSet.add(setKey(x, y, z));
    }
    return cubeSet;
}

function setKey(x, y, z) {
    return `${x}|${y}|${z}`
}

function reduceData(cubeSet) {
    let sides = 0;
    for (const cube of cubeSet) {
        let cubeSides = 6;
        const [x, y, z] = cube.split("|").map(num => parseInt(num));
        for (const offset of offsets) {
            const [oX, oY, oZ] = offset;
            if (cubeSet.has(setKey(x + oX, y + oY, z + oZ))) {
                --cubeSides;
            }
        }
        sides += cubeSides;
    }
    return sides;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const cubeSet = mapData(lines);
    const result = reduceData(cubeSet);
    console.log(result);
}

solve();