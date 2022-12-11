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
            currentMonkey.operation = trimmedLine.split("new = ")[1];;
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

function processRound(monkeys, inspectCount) {
    for (let m = 0; m < monkeys.length; ++m) {
        const monkey = monkeys[m];
        if (monkey.items.length === 0) {
            continue;
        }
        while (monkey.items.length > 0) {
            let worryLevel = monkey.items.shift();
            const expression = monkey.operation.replaceAll("old", worryLevel);
            worryLevel = eval(expression);
            worryLevel = Math.floor(worryLevel / 3);
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
    const NUMBER_OF_ROUNDS = 20;
    let inspectCount = new Array(monkeys.length).fill(0);

    for (let i = 0; i < NUMBER_OF_ROUNDS; ++i) {
        processRound(monkeys, inspectCount);
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