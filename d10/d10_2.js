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
    const crt = new Array(6).fill([]).map(_ => new Array(40).fill("."));

    function increaseCycle() {
        // xRegister is the column
        const row = Math.floor(cycles / 40);
        const col = cycles % 40;
        if (xRegister - 1 === col || xRegister === col || xRegister + 1 === col) {
            crt[row][col] = "#";
        }
        cycles += 1;
    }

    let xRegister = 1;
    let cycles = 0;

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

    return crt.map(row => row.join(" "));
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const instructions = mapData(lines);
    const result = reduceData(instructions);
    console.log(result);
}

solve();