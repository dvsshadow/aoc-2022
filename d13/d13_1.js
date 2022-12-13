import { processLineByLine } from "../utils.js";

function mapData(lines) {
    const linePairs = [];
    let currentPair = [];
    for (const line of lines) {
        if (line === "") {
            linePairs.push(currentPair);
            currentPair = [];
            continue;
        }
        currentPair.push(line);
    }
    linePairs.push(currentPair);
    return linePairs.map((arr) => {
        return {
            left: eval(arr[0]),
            right: eval(arr[1])
        };
    })
}

function comparePackets(left, right) {
    let newLeft = left;
    let newRight = right;

    if (!Array.isArray(newLeft) && Array.isArray(newRight)) {
        newLeft = [newLeft];
    }
    if (Array.isArray(newLeft) && !Array.isArray(newRight)) {
        newRight = [newRight];
    }

    if (Number.isInteger(newLeft) && Number.isInteger(newRight)) {
        if (newLeft < newRight) {
            return 1;
        }
        if (newLeft === newRight) {
            return 0;
        }
        return -1;
    }

    let i = 0;
    while (i < newLeft.length && i < newRight.length) {
        const compareValue = comparePackets(newLeft[i], newRight[i]);
        if (compareValue === 1) {
            return 1;
        }
        if (compareValue === -1) {
            return -1;
        }
        ++i;
    }

    if (i === newLeft.length) {
        if (newLeft.length === newRight.length) {
            return 0;
        }
        return 1;
    }

    return -1;
}

function reduceData(packets) {
    let indexSum = 0;

    for (let i = 0; i < packets.length; i++) {
        const pair = packets[i];
        if(comparePackets(pair.left, pair.right) === 1) {
            indexSum += (i + 1);
        }
    }

    return indexSum;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const packets = mapData(lines);
    const result = reduceData(packets);
    console.log(result);
}

solve();