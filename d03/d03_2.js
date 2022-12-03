import { processLineByLine } from "../utils.js";

async function solve() {
    const lines = await processLineByLine("input.txt");

    const letterValues = [];
    for (let i = 1; i <= 52; ++i) {
        letterValues.push(i);
    }

    function getLetterValue(letter) {
        if (letter.charCodeAt(0) >= 'a'.charCodeAt(0) && letter.charCodeAt(0) <= 'z'.charCodeAt(0)) {
            return letterValues[Math.abs('a'.charCodeAt(0) - letter.charCodeAt(0))];
        } else if (letter.charCodeAt(0) >= 'A'.charCodeAt(0) && letter.charCodeAt(0) <= 'Z'.charCodeAt(0)) {
            return letterValues[26 + Math.abs('A'.charCodeAt(0) - letter.charCodeAt(0))];
        }
    }

    const threeElves = [];
    let currentLine = [];
    for (let i = 0; i < lines.length; i++) {
        if (currentLine.length === 3) {
            threeElves.push(currentLine);
            currentLine = [];
        }
        currentLine.push(lines[i]);
    }
    if (currentLine.length === 3) {
        threeElves.push(currentLine);
    }

    let sum = 0;
    for (let threeElfPair of threeElves) {
        const firstSet = new Set(threeElfPair[0]);
        const secondSet = new Set(threeElfPair[1]);
        const third = threeElfPair[2];
        for (const c of third) {
            if (firstSet.has(c) && secondSet.has(c)) {
                sum += getLetterValue(c);
                break;
            }
        }
    }

    return sum;
}

solve();
