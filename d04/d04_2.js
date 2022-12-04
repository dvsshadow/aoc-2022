import { processLineByLine } from "../utils.js";

async function solve() {
    const lines = await processLineByLine("input.txt");

    let count = 0;
    for (let line of lines) {
        const [left, right] = line.split(",");
        const [leftMin, leftMax] = left.split("-").map(c => parseInt(c));
        const [rightMin, rightMax] = right.split("-").map(c => parseInt(c));

        if ((leftMax >= rightMin && leftMax <= rightMax) ||
            (leftMin >= rightMin && leftMin <= rightMax) ||
            (leftMin >= rightMin && leftMax <= rightMax) ||
            (rightMin >= leftMin && rightMax <= leftMax)) {
            ++count;
        }
    }
    return count;
}

solve();
