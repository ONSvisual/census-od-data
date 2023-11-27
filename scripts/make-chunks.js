import fs from "fs";
import { csvFormat } from "d3-dsv";
import { csvParse } from "./utils.js";
import { inputs } from "./config.js";

const data_path = (filename) => `./output/${filename.toLowerCase().replace("ltla", "lad")}_clean.csv`;
const output_folder = "./output/chunks";
const output_path = (filename, prefix) => `${output_folder}/${filename.toLowerCase().split("_")[0]}_${prefix}.csv`;

for (const input of inputs) {
  const data_raw = fs.readFileSync(data_path(input.filename), {encoding: "utf8", flag: "r"});
  const data = csvParse(data_raw, (d) => ({from: d.from, to: d.to, value: +d.value}));
  console.log(`Loaded ${data.length.toLocaleString()} rows of data from ${data_path(input.filename)}`);

  const codes = Array.from(new Set(data.map(d => d.from))).sort((a, b) => a.localeCompare(b));
  const prefixes = Array.from(new Set(codes.filter(code => typeof code === "string" && ["E", "W"].includes(code[0])).map(code => code.slice(0, 8))));

  for (const prefix of prefixes) {
    const filtered = data.filter(d => d.from.slice(0, 8) === prefix || d.to.slice(0, 8) === prefix);
    const path = output_path(input.filename, prefix);
    if (!fs.existsSync(output_folder)) fs.mkdirSync(output_folder);
    fs.writeFileSync(path, csvFormat(filtered));
    console.log(`Wrote ${path}`);
  }
  console.log(`Wrote ${prefixes.length} output files`);
}