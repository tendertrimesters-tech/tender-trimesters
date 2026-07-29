import { MEDITATIONS } from "../src/data/meditations";
import * as fs from "fs";
import * as path from "path";

const outPath = path.join(__dirname, "meditations-data.json");
fs.writeFileSync(outPath, JSON.stringify(MEDITATIONS, null, 2));
console.log(`OK  wrote ${outPath}  (${MEDITATIONS.length} meditations)`);
