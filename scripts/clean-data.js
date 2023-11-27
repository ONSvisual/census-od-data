import fs from "fs";
import zlib from "zlib";
import { csvFormat } from "d3-dsv";
import { csvParse } from "./utils.js";
import { inputs, ni_codes } from "./config.js";

const read_gzip = (path) => zlib.gunzipSync(fs.readFileSync(path)).toString();
const data_path = (filename) => `./input/${filename}.csv.gz`;
const output_path = (filename) => `./output/${filename.toLowerCase().replace("ltla", "lad")}_clean.csv`;
const fix_code = (code) => ni_codes[code] || code;

for (const input of inputs) {
  const data_raw = read_gzip(data_path(input.filename));
  const data = csvParse(data_raw, (d) => {
    const value = +d["Count"];
    const wfh = +d["Place of work indicator (4 categories) code"] === 1;
    const na = +d[input.from] === -8 || +d[input.to] === -8; // Filters out not applicable rows
    // const im = +d[input.from] === 999999999; // Origin outside the UK (filters out international migration)
    // return value && !na && !im ? {from: fix_code(d[input.from]), to: wfh ? 111111111 : fix_code(d[input.to]), value} : null;
    return value && !na ? {from: fix_code(d[input.from]), to: wfh ? 111111111 : fix_code(d[input.to]), value} : null;
  });
  console.log(`Loaded ${data.length.toLocaleString()} rows of data from ${data_path(input.filename)}`);

  fs.writeFileSync(output_path(input.filename), csvFormat(data));
  console.log(`Wrote clean data to ${output_path(input.filename)}`);
}