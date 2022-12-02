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
    };
    const winMap = {
        A: "Y",
        B: "Z",
        C: "X",
    };
    const lossMap = {
        A: "Z",
        B: "X",
        C: "Y"
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
        // X lose
        // Y draw
        // Z win
        if (myPlay === "X") {
            score += shapeScore[lossMap[otherPlay]];
            score += matchScore["LOSS"];
        } else if (myPlay === "Y") {
            score += shapeScore[reverseMap[otherPlay]];
            score += matchScore["DRAW"]
        } else if (myPlay === "Z") {
            score += shapeScore[winMap[otherPlay]];
            score += matchScore["WIN"];
        }
    }

    return score;
}

solve();
