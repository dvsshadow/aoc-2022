import {processLineByLine} from "../utils.js";

function mapData(lines) {
    const blueprints = [];

    for (const line of lines) {
        const [oreRobotStr, clayRobotStr, obsidianRobotStr, geodeRobotStr] = line.split(".");
        const oreRobot = {
            ore: parseInt(oreRobotStr.split("costs")[1])
        };
        const clayRobot = {
            ore: parseInt(clayRobotStr.split("costs")[1])
        }
        const obsidianRobot = {
            ore: parseInt(obsidianRobotStr.split("costs")[1]),
            clay: parseInt(obsidianRobotStr.split("and")[1]),
        }
        const geodeRobot = {
            ore: parseInt(geodeRobotStr.split("costs")[1]),
            obsidian: parseInt(geodeRobotStr.split("and")[1]),
        }
        blueprints.push({
            oreRobot,
            clayRobot,
            obsidianRobot,
            geodeRobot
        });
    }

    return blueprints;
}

function getMaxGeodes(blueprint, minutes) {
    let maxGeodes = 0;
    const bfsQueue = [];
    bfsQueue.push([[1, 0, 0, 0], [0, 0, 0, 0], minutes]);
    const visited = new Set();

    let currentMinute = minutes;
    const maxOreNeeded = Math.max(blueprint.oreRobot.ore, blueprint.clayRobot.ore, blueprint.obsidianRobot.ore, blueprint.geodeRobot.ore);

    function tryAdd(robots, minerals, minutes) {
        let [ore, clay, obsidian, geode] = minerals;
        let [oreRbt, clayRbt, obsidianRbt, geodeRbt] = robots;

        if (minutes === 0) {
            maxGeodes = Math.max(maxGeodes, geode);
            return;
        }

        oreRbt = Math.min(oreRbt, maxOreNeeded);
        clayRbt = Math.min(clayRbt, blueprint.obsidianRobot.clay);
        obsidianRbt = Math.min(obsidianRbt, blueprint.geodeRobot.obsidian)

        const maxOreToProduce = minutes * maxOreNeeded - (oreRbt * (minutes - 1));
        const maxClayToProduce = minutes * blueprint.obsidianRobot.clay - (clayRbt * (minutes - 1));
        const maxObsidianToProduce = minutes * blueprint.geodeRobot.obsidian - (obsidianRbt * (minutes - 1));

        ore = Math.min(ore, maxOreToProduce);
        clay = Math.min(clay, maxClayToProduce);
        obsidian = Math.min(obsidian, maxObsidianToProduce)

        minerals = [ore, clay, obsidian, geode];
        robots = [oreRbt, clayRbt, obsidianRbt, geodeRbt];

        if (visited.has(JSON.stringify([robots, minerals]))) {
            return;
        }
        visited.add(JSON.stringify([robots, minerals]));
        bfsQueue.push([robots, minerals, minutes]);
    }

    while (bfsQueue.length > 0) {
        const [robots, minerals, minutes] = bfsQueue.shift();
        let [ore, clay, obsidian, geode] = minerals;
        let [oreRbt, clayRbt, obsidianRbt, geodeRbt] = robots;

        if (minutes < currentMinute) {
            currentMinute = minutes;
        }

        if (blueprint.oreRobot.ore <= ore) {
            tryAdd(
                [oreRbt + 1, clayRbt, obsidianRbt, geodeRbt],
                [ore + oreRbt - blueprint.oreRobot.ore, clay + clayRbt, obsidian + obsidianRbt, geode + geodeRbt],
                minutes - 1);
        }
        if (blueprint.clayRobot.ore <= ore) {
            tryAdd(
                [oreRbt, clayRbt + 1, obsidianRbt, geodeRbt],
                [ore + oreRbt - blueprint.clayRobot.ore, clay + clayRbt, obsidian + obsidianRbt, geode + geodeRbt],
                minutes - 1);
        }
        if (blueprint.obsidianRobot.ore <= ore && blueprint.obsidianRobot.clay <= clay) {
            tryAdd(
                [oreRbt, clayRbt, obsidianRbt + 1, geodeRbt],
                [ore + oreRbt - blueprint.obsidianRobot.ore, clay + clayRbt - blueprint.obsidianRobot.clay, obsidian + obsidianRbt, geode + geodeRbt],
                minutes - 1);
        }
        if (blueprint.geodeRobot.ore <= ore && blueprint.geodeRobot.obsidian <= obsidian) {
            tryAdd(
                [oreRbt, clayRbt, obsidianRbt, geodeRbt + 1],
                [ore + oreRbt - blueprint.geodeRobot.ore, clay + clayRbt, obsidian + obsidianRbt - blueprint.geodeRobot.obsidian, geode + geodeRbt],
                minutes - 1);
        }

        tryAdd(
            [oreRbt, clayRbt, obsidianRbt, geodeRbt],
            [ore + oreRbt, clay + clayRbt, obsidian + obsidianRbt, geode + geodeRbt],
            minutes - 1);
    }
    return maxGeodes;
}

function reduceData(blueprints) {
    let qualitySum = 0;
    for (let i = 0; i < blueprints.length; i++) {
        const blueprint = blueprints[i];
        qualitySum += (i + 1) * getMaxGeodes(blueprint, 24);
    }
    return qualitySum;
}

async function solve() {
    const lines = await processLineByLine("input.txt");
    const blueprints = mapData(lines);
    const result = reduceData(blueprints);
    console.log(result);
}

solve();