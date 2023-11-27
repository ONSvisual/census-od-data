import fs from "fs";
import { csvFormat } from "d3-dsv";
import { csvParse } from "./utils.js";
import { inputs } from "./config.js";

const sum = (d) => {
  return Object.keys(d).map(key => d[key])
    .reduce((a, b) => a + b, 0);
}

const top = (d, filter = () => true, count = 3) => {
  return Object.keys(d).map(key => ({key, value: d[key]}))
    .filter(filter)
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}

const makeFilter = (code) => (item) => 
  ![code, "111111111", "888888888", "999999999"].includes(item.key) &&
  !["N", "S"].includes(item.key[0]);

const data_path = (filename) =>  `./output/${filename.toLowerCase().replace("ltla", "lad")}_clean.csv`;
const output_path = (filename) => `./output/${filename.toLowerCase().replace("ltla", "lad")}_counts.csv`;

for (const input of inputs) {
  const data_raw = fs.readFileSync(data_path(input.filename), {encoding: "utf8", flag: "r"});
  const data = csvParse(data_raw, (d) => ({from: d.from, to: d.to, value: +d.value}));
  console.log(`Loaded ${data.length.toLocaleString()} rows of data from ${data_path(input.filename)}`);

  console.log("Indexing data...");
  const from = {};
  const to = {};
  const codes = [];
  for (const d of data) {
    if (!from[d.from]) {
      from[d.from] = {};
      codes.push(d.from);
    }
    if (!to[d.to]) to[d.to] = {};
    from[d.from][d.to] = d.value;
    to[d.to][d.from] = d.value;
  }

  const output = [];

  for (const code of codes.filter(c => typeof c === "string" && ["E", "W"].includes(c[0]))) {
    console.log(`Processing ${code}...`);
    const nomove = from?.[code]?.["111111111"] || 0;
    const within = from?.[code]?.[code] || 0;
    const fromout = from?.["999999999"]?.[code] || 0;
    const toout = (from?.[code]?.["888888888"] || 0) + (from?.[code]?.["999999999"] || 0);
    const row = {areacd: code, origin: sum(from[code]), destination: sum(to[code]) + nomove, nomove, within, fromout, toout};
    top(from[code], makeFilter(code)).forEach((item, i) => {
      row[`to${i + 1}cd`] = item.key;
      row[`to${i + 1}`] = item.value;
    });
    top(to[code], makeFilter(code)).forEach((item, i) => {
      row[`from${i + 1}cd`] = item.key;
      row[`from${i + 1}`] = item.value;
    });
    output.push(row);
  }

  fs.writeFileSync(output_path(input.filename), csvFormat(output));
  console.log(`Wrote ${output_path(input.filename)}`); 
}