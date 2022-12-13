import { processLineByLine } from "../utils.js";

function mapData(lines) {
    const packets = [];
    for (const line of lines) {
        if (line !== "") {
            packets.push(eval(line));
        }
    }
    packets.push([[2]]);
    packets.push([[6]]);
    return packets;
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
    const newPackets = packets.sort((left, right) => comparePackets(left, right)).reverse();

    let dividerProduct = 1;
    newPackets.forEach((packet, idx) => {
        if (JSON.stringify([[2]]) === JSON.stringify(packet) || JSON.stringify([[6]]) === JSON.stringify(packet)) {
            dividerProduct *= (idx + 1);
        }
    })

    return dividerProduct;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const packets = mapData(lines);
    const result = reduceData(packets);
    console.log(result);
}

solve();