import * as d3 from "d3-dsv";

export function round(value, dp = 4) {
  const multiplier = Math.pow(10, dp);
  return typeof value === "number" ? Math.round(value * multiplier) / multiplier : value;
}

export function csvParse(str, row = (d) => d) {
  return d3.csvParse(str.replace(/\uFEFF/, ''), row);
}