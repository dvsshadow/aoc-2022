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

    let sum = 0;

    for (let line of lines) {
        const left = line.substring(0, Math.floor(line.length / 2));
        const right = line.substring(Math.floor(line.length / 2), line.length);
        const leftSet = new Set();
        for (const c of left) {
            leftSet.add(c);
        }
        for (const c of right) {
            if (leftSet.has(c)) {
                sum += getLetterValue(c);
                break;
            }
        }
    }

    return sum;
}

solve();
