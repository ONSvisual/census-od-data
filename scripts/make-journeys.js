import fs from "fs";
import { csvParse } from "./utils.js";
import { csvFormat } from "d3-dsv";
import * as config from "./config.js";

const inputs = config.inputs.filter(d => d.geo === "msoa");

const data_path = (filename) =>  `./output/${filename.toLowerCase().replace("ltla", "lad")}_clean.csv`;
const output_path = (filename, ppd) => `./output/${filename.toLowerCase().replace("ltla", "lad")}_${ppd}ppd.csv`;

for (const input of inputs) {
  const ppd = input.ppd; // People per dot
  const data_raw = fs.readFileSync(data_path(input.filename), {encoding: "utf8", flag: "r"});
  const data = csvParse(data_raw, (d) => ({from: d.from, to: d.to, value: +d.value}));
  console.log(`Loaded ${data.length.toLocaleString()} rows of data from ${data_path(input.filename)}`);

  const total = data.map(d => d.value).reduce((a, b) => a + b, 0);
  const output = [];

  let row = 0;
  let row_i = 0;

  for (let i = 0; i < total; i++) {
    if (i % ppd === 0) output.push({from: data[row].from, to: data[row].to});
    if (i % (ppd * 100) === 0) console.log(`Generated ${(i / ppd).toLocaleString()} rows...`)
    if (row_i === data[row].value - 1) {
      row_i = 0;
      row ++;
    } else {
      row_i ++;
    }
  }

  fs.writeFileSync(output_path(input.filename, ppd), csvFormat(output));
  console.log(`Wrote ${output_path(input.filename, ppd)}`);
}