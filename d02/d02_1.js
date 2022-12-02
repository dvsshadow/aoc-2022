import { processLineByLine } from "../utils.js";

async function solve() {
  const lines = await processLineByLine("input.txt");
  lines.pop();

  const rounds = lines.map(s => s.split(" "));

  const shapeScore = {
    X: 1,
    Y: 2,
    Z: 3,
  };
  const reverseMap = {
    A: "X",
    B: "Y",
    C: "Z",
  }
  const matchScore = {
    WIN: 6,
    LOSS: 0,
    DRAW: 3,
  };

  let score = 0;
  for (let i = 0; i < rounds.length; i++) {
    const otherPlay = rounds[i][0];
    const myPlay = rounds[i][1];
    score += shapeScore[myPlay];
    if ((myPlay === "X" && otherPlay === "C") || (myPlay === "Y" && otherPlay === "A") || (myPlay === "Z" && otherPlay === "B")) {
      score += matchScore["WIN"];
    } else if (myPlay === reverseMap[otherPlay]) {
      score += matchScore["DRAW"];
    } else {
      score += matchScore["LOSS"];
    }
  }

  return score;
}

solve();
