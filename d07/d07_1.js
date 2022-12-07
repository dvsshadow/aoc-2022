import { processLineByLine } from "../utils.js";

const COMMAND_SIGN = "$"
const CHANGE_DIRECTORY = "cd";
const LIST_FILES = "ls";

function handleProcessing(splitLine, currentNode) {
    if (splitLine[0] === "dir") {
        // create new node
        const dirName = splitLine[1];
        currentNode.children.set(dirName, {
            name: dirName,
            parent: currentNode,
            children: new Map()
        });
        return;
    }
    // it's a file
    const size = splitLine[0];
    const fileName = splitLine[1];
    currentNode.children.set(fileName, {
        name: fileName,
        parent: currentNode,
        size: size
    });
}

function handleDirectoryChange(splitLine, currentNode) {
    // in, out, or root
    const directoryName = splitLine[2];
    if (directoryName === "..") {
        return currentNode.parent;
    } else if (directoryName === "/") {
        while (currentNode.parent) {
            currentNode = currentNode.parent;
        }
        return currentNode;
    } else {
        return currentNode.children.get(directoryName);
    }
}

function mapData(linesArr) {
    let currentNode = {
        name: "/",
        parent: null,
        children: new Map()
    }

    linesArr = linesArr.slice(2, linesArr.length);

    for (const line of linesArr) {
        const splitLine = line.split(" ");
        // ignore commands for now
        if (splitLine[0] === COMMAND_SIGN) {
            // changing directory means changing the current node
            // ls is to be ignored
            if (splitLine[1] === LIST_FILES) {
                continue;
            } if (splitLine[1] === CHANGE_DIRECTORY) {
                currentNode = handleDirectoryChange(splitLine, currentNode);
            }
            continue;
        }
        handleProcessing(splitLine, currentNode);
    }

    return handleDirectoryChange("$ cd /".split(" "), currentNode);
}

function reduceData(fileTree) {
    // get size of current directory
    // then bfs the child directories
    let sum = 0;

    function dfs(node, currentSum) {
        let thisSum = 0;
        for (const [name, child] of node.children) {
            if (child.children) {
                // is directory
                thisSum += dfs(child, 0);
            } else if (child.size) {
                // is file
                thisSum += parseInt(child.size);
            }
        }
        if (thisSum <= 100000) {
            sum += thisSum;
        }
        return thisSum;
    }

    dfs(fileTree);
    return sum;
}



async function solve() {
    const lines = await processLineByLine("input.txt");
    const fileTree = mapData(lines);
    const result = reduceData(fileTree);
    console.log(result);
}

solve();