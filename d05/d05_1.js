import { processLineByLine } from "../utils.js";

async function solve() {
    const lines = await processLineByLine("input.txt");

    const s = lines.indexOf("");
    const rawBoxes = lines.slice(0, s);
    const rawInstructions = lines.slice(s + 1, lines.length);

    // remove indices
    rawBoxes.pop();

    // create an array that represents each level
    const levels = [];
    for (let i = 0; i < rawBoxes.length; ++i) {
        const currentLevel = rawBoxes[i];
        const toAdd = [];
        for (let j = 0; j < currentLevel.length; j += 4) {
            const currentChar = currentLevel.slice(j, j + 3);
            toAdd.push(currentChar[1]);
        }
        levels.push(toAdd);
    }

    // iterate through each level and push to a box if it's a number
    const boxes = new Array(levels[0].length).fill([]).map(_ => []);
    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        for (let j = 0; j < level.length; j++) {
            if (level[j] !== " ") {
                boxes[j].push(level[j]);
            }
        }
    }

    // map and iterate instructions
    const instructions = [];
    for (let i = 0; i < rawInstructions.length; i++) {
        const currentInstruction = rawInstructions[i];
        const quantityString = currentInstruction.split("from")[0].replace(/\D/g, '');
        const fromString = currentInstruction.split("to")[0].split("from")[1].replace(/\D/g, '');
        const toString = currentInstruction.split("to")[1].replace(/\D/g, '');
        instructions.push([
            parseInt(quantityString),
            parseInt(fromString),
            parseInt(toString)
        ])
    }

    for (const instruction of instructions) {
        const [quantity, fromIdx, toIdx] = instruction.map(n => parseInt(n));
        for (let i = 0; i < quantity; i++) {
            const popped = boxes[fromIdx - 1].shift();
            boxes[toIdx - 1].unshift(popped);
        }

    }

    const toReturn = [];
    for (let box of boxes) {
        toReturn.push(box[0]);
    }

    console.log(toReturn.join(""));
}

solve();
