import fs from "fs";
import { csvParse, round } from "./utils.js";
import { csvFormat } from "d3-dsv";
import * as turf from "@turf/turf";

function getBBOX(feature) {
  const bbox = turf.bbox(feature);
  return {xmin: round(bbox[0], 3), ymin: round(bbox[1], 3), xmax: round(bbox[2], 3), ymax: round(bbox[3], 3)}
}

const msoa_path = "./input/msoa21_bgc.json";
const scot_path = "./input/msoa11_bgc_scot.json";
const lad_path = "./input/lad21_bgc.json";
const names_path = "./input/msoa21_names.csv";
const parents_path = "./input/oa21_lsoa21_msoa21_lad21_lookup.csv";
const scot_parents_path = "./input/msoa11_lad21_lookup_scot.csv";
const msoa_output_path = "./output/msoa21_metadata.csv";
const lad_output_path = "./output/lad21_metadata.csv";

const msoa = JSON.parse(fs.readFileSync(msoa_path, {encoding: "utf8", flag: "r"}));
const scot = JSON.parse(fs.readFileSync(scot_path, {encoding: "utf8", flag: "r"}));
const lad = JSON.parse(fs.readFileSync(lad_path, {encoding: "utf8", flag: "r"}));
const names = csvParse(fs.readFileSync(names_path, {encoding: "utf8", flag: "r"}));
const parents = csvParse(fs.readFileSync(parents_path, {encoding: "utf8", flag: "r"}));
const scot_parents = csvParse(fs.readFileSync(scot_parents_path, {encoding: "utf8", flag: "r"}));
console.log("Data loaded");

const names_lookup = {};
names.forEach(d => names_lookup[d.msoa21cd] = d.msoa21hclnm);
const parents_lookup = {};
parents.forEach(d => parents_lookup[d.msoa21cd] = d.lad21cd);
scot_parents.forEach(d => parents_lookup[d.msoa11cd] = d.lad21cd);
console.log("Lookups created");

const msoa_output = [];
for (const feature of msoa.features) {
  const areacd = feature.properties.areacd;
  msoa_output.push({
    areacd,
    areanm: names_lookup[areacd],
    parentcd: parents_lookup[areacd],
    ...getBBOX(feature)
  });
}
for (const feature of scot.features) {
  const areacd = feature.properties.areacd;
  msoa_output.push({
    areacd: areacd,
    areanm: feature.properties.areanm,
    parentcd: parents_lookup[areacd],
    ...getBBOX(feature)
  });
}
fs.writeFileSync(msoa_output_path, csvFormat(msoa_output));
console.log(`Wrote ${msoa_output_path}`);

const lad_output = [];
for (const feature of lad.features) {
  lad_output.push({
    areacd: feature.properties.areacd,
    areanm: feature.properties.areanm,
    ...getBBOX(feature)
  });
}
fs.writeFileSync(lad_output_path, csvFormat(lad_output));
console.log(`Wrote ${lad_output_path}`);