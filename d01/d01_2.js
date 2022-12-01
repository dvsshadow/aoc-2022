import {processLineByLine} from "../utils.js";

async function solve() {
    const lines = await processLineByLine("input.txt");
    const calories = [];
    let currentSum = 0;
    for (let line of lines) {
        if (line === "") {
            calories.push(currentSum);
            currentSum = 0;
            continue;
        }
        currentSum += parseInt(line);
    }

    calories.sort((a, b) => b - a);
    let top3Sum = 0;
    for (let i = 0; i < 3; i++) {
        top3Sum += calories[i];
    }
    console.log(top3Sum);
}

solve();


