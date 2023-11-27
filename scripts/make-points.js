import fs from "fs";
import { csvFormat, autoType } from "d3-dsv";
import * as turf from "@turf/turf";
import { csvParse, round } from "./utils.js";
import * as config from "./config.js";

const inputs = config.inputs.filter(d => d.geo === "msoa");
const data_path = (filename, ppd) => `./output/${filename.toLowerCase().replace("ltla", "lad")}_${ppd}ppd.csv`;
const output_path = (filename) => `./output/${filename.toLowerCase().split("_")[0]}_points.csv`;
const geo_path = "./input/msoa21_bgc.json";
const scot_path = "./input/msoa11_bgc_scot.json";
const lad_path = "./input/lad21_bgc.json";

function pointInPoly(polygon) {
  const bbox = turf.bbox(polygon);
  const point = turf.randomPoint(1, {bbox}).features[0];
  return turf.booleanPointInPolygon(point, polygon) ? point.geometry.coordinates : pointInPoly(polygon);
}

const geo = JSON.parse(fs.readFileSync(geo_path, {encoding: "utf8", flag: "r"}));
console.log(`Loaded ${geo.features.length.toLocaleString()} boundaries from ${geo_path}`);
const scot = JSON.parse(fs.readFileSync(scot_path, {encoding: "utf8", flag: "r"}));
console.log(`Loaded ${scot.features.length.toLocaleString()} boundaries from ${scot_path}`);
const lad = JSON.parse(fs.readFileSync(lad_path, {encoding: "utf8", flag: "r"}));
console.log(`Loaded ${lad.features.length.toLocaleString()} boundaries from ${lad_path}`);

const boundaries = {};
geo.features.forEach(f => boundaries[f.properties.areacd] = f.geometry);
scot.features.forEach(f => boundaries[f.properties.areacd] = f.geometry);
lad.features.forEach(f => boundaries[f.properties.areacd] = f.geometry);

for (const input of inputs) {
  const ppd = input.ppd;
  const data_raw = fs.readFileSync(data_path(input.filename, ppd), {encoding: "utf8", flag: "r"});
  const data = csvParse(data_raw, autoType);
  console.log(`Loaded data from ${data_path(input.filename, ppd)}`);

  const points = [];

  let i = 0;
  for (const d of data) {
    if (i % 100 === 0) console.log(`Generated ${i.toLocaleString()} points...`);
    const from = typeof d.from === "number" ? "" : pointInPoly(boundaries[d.from]);
    const to = typeof d.to === "number" ? "" : pointInPoly(boundaries[d.to]);
    points.push({...d, x1: round(from[0]), y1: round(from[1]), x2: round(to[0]), y2: round(to[1])});
    i ++;
  }

  fs.writeFileSync(output_path(input.filename), csvFormat(points));
  console.log(`Wrote ${output_path(input.filename)}`);
}
