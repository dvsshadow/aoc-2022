import {processLineByLine} from "../utils.js";

async function solve() {
  const lines = await processLineByLine("input.txt");
  let maxCalories = 0;
  let currentSum = 0;
  for (let line of lines) {
    if (line === "") {
      currentSum = 0;
      continue;
    }
    currentSum += parseInt(line);
    maxCalories = Math.max(maxCalories, currentSum);
  }
  console.log(maxCalories);
}

solve();


