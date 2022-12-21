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

    function getRootValue(hmnValue) {
        const numbersMap = new Map();
        numbersMap.set("humn", hmnValue);
        function canCalculateRoot() {
            const [leftMonkey, rightMonkey] = monkeyMap.get("root").split(/[+\/\-*]/).map(s => s.trim());
            if (numbersMap.has(leftMonkey) && numbersMap.has(rightMonkey)) {
                numbersMap.set("root",`${numbersMap.get(leftMonkey)} - ${numbersMap.get(rightMonkey)}`);
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
        return eval(numbersMap.get("root"));
    }


    // the second value always stays the same so we can do binary search
    // if negative it needs to be lower
    // if positive it needs to be higher

    let high = 10 ** 19;
    let low = 0;

    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        const currentRoot = getRootValue(mid);
        if (currentRoot === 0) {
            return mid;
        } else if (currentRoot < 0) {
            high = mid;
        } else {
            low = mid;
        }
    }
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const monkeyMap = mapData(lines);
    const result = reduceData(monkeyMap);
    console.log(result);
}

solve();