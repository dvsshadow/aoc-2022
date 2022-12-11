import { processLineByLine } from "../utils.js";

function mapData(lines) {
    const monkeysToReturn = [];
    let currentMonkey = {
        items: [],
        operation: null,
        divisible: null,
        trueIdx: 0,
        falseIdx: 0
    };

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === "") {
            monkeysToReturn.push(currentMonkey);
            currentMonkey = {
                items: [],
                operation: null,
                divisible: null,
                trueIdx: 0,
                falseIdx: 0
            };
        } else if (trimmedLine.startsWith("Starting items:")) {
            let items = trimmedLine.split("Starting items: ")[1];
            items = items.replace(" ", "");
            items = items.split(",").map(s => parseInt(s));
            currentMonkey.items = items;
        } else if (trimmedLine.startsWith("Operation:")) {
            currentMonkey.operation = trimmedLine.split("new = ")[1];
        } else if (trimmedLine.startsWith("Test:")) {
            currentMonkey.divisible = parseInt(trimmedLine.split("Test: divisible by ")[1]);
        } else if (trimmedLine.startsWith("If true:")) {
            currentMonkey.trueIdx = parseInt(trimmedLine.split("If true: throw to monkey ")[1]);
        } else if (trimmedLine.startsWith("If false:")) {
            currentMonkey.falseIdx = parseInt(trimmedLine.split("If false: throw to monkey ")[1]);
        }
    }
    monkeysToReturn.push(currentMonkey);

    return monkeysToReturn;
}

function processRound(monkeys, inspectCount, commonMultiple) {
    const SUM_OR_MULTIPLY_IDX = 4;
    for (let m = 0; m < monkeys.length; ++m) {
        const monkey = monkeys[m];
        if (monkey.items.length === 0) {
            continue;
        }

        while (monkey.items.length > 0) {
            let worryLevel = monkey.items.shift();

            // (a mod x + b mod x) mod x
            const operationSign = monkey.operation[SUM_OR_MULTIPLY_IDX];
            // always old * | old +
            const leftOperand = worryLevel % commonMultiple;
            const rightOperandString = monkey.operation.split(operationSign)[1].trim();
            let rightOperand;
            if (rightOperandString === "old") {
                rightOperand = worryLevel % commonMultiple;
            } else {
                rightOperand = parseInt(rightOperandString) % commonMultiple;
            }

            worryLevel = eval(`${leftOperand} ${operationSign} ${rightOperand}`) % commonMultiple;
            if (worryLevel % monkey.divisible === 0) {
                monkeys[monkey.trueIdx].items.push(worryLevel);
            } else {
                monkeys[monkey.falseIdx].items.push(worryLevel);
            }

            inspectCount[m] += 1;
        }
    }
}

function reduceData(monkeys) {
    const NUMBER_OF_ROUNDS = 10000;
    let inspectCount = new Array(monkeys.length).fill(0);

    // Common multiple between all the divisors so that we can create a boundary for the numbers using mod
    let commonMultiple = 1;
    for (const monkey of monkeys) {
        commonMultiple *= monkey.divisible;
    }

    for (let i = 0; i < NUMBER_OF_ROUNDS; ++i) {
        processRound(monkeys, inspectCount, commonMultiple);
    }

    inspectCount.sort((a, b) => b - a);
    return inspectCount[0] * inspectCount[1];
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const monkeys = mapData(lines);
    const result = reduceData(monkeys);
    console.log(result);
}

solve();