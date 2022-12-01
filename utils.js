import fs from "fs";
import readline from "readline";

export async function processLineByLine(fileName) {
  const fileStream = fs.createReadStream(fileName);
  const toReturn = [];

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    toReturn.push(line);
  }
  toReturn.push("");
  return toReturn;
}