import fs from 'fs';
import { csvParse } from "./utils.js";
import * as config from "./config.js";
import { compressData } from 'compress-csv-to-json';

const inputs = config.inputs.filter(d => d.geo === "msoa");
const path = (filename, ext) => `./output/${filename.toLowerCase().split("_")[0]}_points.${ext}`;

for (const input of inputs) {
	const csvFilename = path(input.filename, 'csv');
    const jsonFilename = path(input.filename, 'json');
	const fileContent = fs.readFileSync(csvFilename, {encoding: 'utf8', flag: 'r'});
	const csvLines = csvParse(fileContent);
	const compressed = compressData(csvLines, [
		{key: 'from', colType: 'interned_string'},
		{key: 'to', colType: 'interned_string'},
		{key: 'x1', colType: 10_000},
		{key: 'y1', colType: 10_000},
		{key: 'x2', colType: 10_000},
		{key: 'y2', colType: 10_000},
	]);
	fs.writeFileSync(jsonFilename, JSON.stringify(compressed));
    console.log(`Wrote ${jsonFilename}`);
}