import { processLineByLine } from "../utils.js";

const NO_OP = "noop";
const ADD_X = "addx";

function mapData(lines) {
    return lines.map(s => {
        return {
            command: s.split(" ")[0],
            value: s.split(" ")[1]
        };
    })
}

function reduceData(instructions) {
    const cyclesSet = new Set([20, 60, 100, 140, 180, 220]);
    function increaseCycle() {
        cycles += 1;
        if (cyclesSet.has(cycles)) {
            strengthSum += (xRegister * cycles);
        }
    }

    let xRegister = 1;
    let cycles = 0;
    let strengthSum = 0;

    for (const ins of instructions) {
        const { command, value } = ins;
        if (command === NO_OP) {
            increaseCycle();
        } else if (command === ADD_X) {
            increaseCycle();
            increaseCycle();
            xRegister += parseInt(value);
        }
    }

    return strengthSum;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const instructions = mapData(lines);
    const result = reduceData(instructions);
    console.log(result);
}

solve();