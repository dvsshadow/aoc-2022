import {processLineByLine} from "../utils.js";

function mapData(lines) {
    const monkeyMap = new Map();
    for (const line of lines) {
        const [name, expression] = line.split(":");
        monkeyMap.set(name, expression.trim());
    }
    return monkeyMap;
}

function reduceData(monkeyMap) {
    const numbersMap = new Map();

    function canCalculateRoot() {
        const [leftMonkey, rightMonkey] = monkeyMap.get("root").split(/[+\/\-*]/).map(s => s.trim());
        if (numbersMap.has(leftMonkey) && numbersMap.has(rightMonkey)) {
            const replaced = monkeyMap.get("root")
                .replace(leftMonkey, numbersMap.get(leftMonkey))
                .replace(rightMonkey, numbersMap.get(rightMonkey))
            numbersMap.set("root", eval(replaced));
            return true;
        }
        return false;
    }

    while (!canCalculateRoot()) {
        for (const [monkeyName, expression] of monkeyMap) {
            if (numbersMap.has(monkeyName)) {
                continue;
            }
            if (!numbersMap.has(monkeyName) && !isNaN(expression)) {
                numbersMap.set(monkeyName, parseInt(expression));
                continue;
            }
            const [leftMonkey, rightMonkey] = expression.split(/[+\/\-*]/).map(s => s.trim());
            if (numbersMap.has(leftMonkey) && numbersMap.has(rightMonkey)) {
                const replaced = expression
                    .replace(leftMonkey, numbersMap.get(leftMonkey))
                    .replace(rightMonkey, numbersMap.get(rightMonkey))
                numbersMap.set(monkeyName, eval(replaced));
            }
        }
    }

    return numbersMap.get("root");
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const monkeyMap = mapData(lines);
    const result = reduceData(monkeyMap);
    console.log(result);
}

solve();