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
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minZ = Number.MAX_SAFE_INTEGER;
    let maxZ = Number.MIN_SAFE_INTEGER;

    for (const cube of cubeSet) {
        const [x, y, z] = cube.split("|").map(num => parseInt(num));
        minX = Math.min(x, minX);
        maxX = Math.max(x, maxX);
        minY = Math.min(y, minY);
        maxY = Math.max(y, maxY);
        minZ = Math.min(z, minZ);
        maxZ = Math.max(z, maxZ);
    }

    const outerCubeSize = maxZ * maxY * maxX;

    for (const cube of cubeSet) {
        const [x, y, z] = cube.split("|").map(num => parseInt(num));
        console.log(setKey(x, y, z) + " : " + sides);
        for (const offset of offsets) {
            const [oX, oY, oZ] = offset;
            if (touchesOuterCube(x + oX, y + oY, z + oZ)) {
                sides += 1;
            }
        }
    }

    
    function touchesOuterCube(x, y, z) {
        const seen = new Set();
        const coordinatesQueue = [];
        coordinatesQueue.push(setKey(x, y, z));
        while (coordinatesQueue.length > 0) {
            const [newX, newY, newZ] = coordinatesQueue.shift().split("|").map(num => parseInt(num));
            if (cubeSet.has(setKey(newX, newY, newZ))) {
                continue;
            }
            if (seen.has(setKey(newX, newY, newZ))) {
                continue;
            }
            seen.add(setKey(newX, newY, newZ));
            if (seen.size > outerCubeSize) {
                return true;
            }
            for (const offset of offsets) {
                const [oX, oY, oZ] = offset;
                coordinatesQueue.push(setKey(newX + oX, newY + oY, newZ + oZ));
            }
        }
        return false;
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