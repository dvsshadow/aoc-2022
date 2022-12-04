import { processLineByLine } from "../utils.js";

async function solve() {
    const lines = await processLineByLine("input.txt");

    let count = 0;
    for (let line of lines) {
        const [left, right] = line.split(",");
        const [leftMin, leftMax] = left.split("-").map(c => parseInt(c));
        const [rightMin, rightMax] = right.split("-").map(c => parseInt(c));

        // find highest
        const leftValue = leftMax - leftMin;
        const rightValue = rightMax - rightMin;

        let biggest;
        let smallest;
        if (rightValue === leftValue) {
            // doesn't matter which one we choose if they are the same
            biggest = [rightMin, rightMax];
            smallest = [leftMin, leftMax];
        } else if (rightValue >= leftValue) {
            // here we check if left is inside right
            biggest = [rightMin, rightMax];
            smallest = [leftMin, leftMax];
        } else if (leftValue >= rightValue) {
            // here we check if right is inside left
            biggest = [leftMin, leftMax];
            smallest = [rightMin, rightMax];
        }

        // check if they intersect
        if (smallest[0] >= biggest[0] && smallest[1] <= biggest[1]) {
            // fully contained
            count += 1;
        }
    }
    return count;
}

solve();
