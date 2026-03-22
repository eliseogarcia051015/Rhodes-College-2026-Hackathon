// Run: node processData.js
// Reads ACSST5Y2024.S1601-Data.csv → writes data.json
import fs from "fs";
import { parse } from "csv-parse/sync";

// Read CSV 
const raw = fs.readFileSync("ACSST5Y2024.S1601-Data.csv", "utf8");
const rows = parse(raw, { 
  columns: true, 
  skip_empty_lines: true, 
  bom: true,
  relax_quotes: true 
});

// skip "Geography"
const dataRows = rows.slice(1);

// S1601, 2024 ACS 5-year, census tract level
// S1601_C01_001E = Total population 5+
// S1601_C01_003E = Speak a language other than English (count)
// S1601_C01_004E = Spanish (count)
// S1601_C01_008E = Other Indo-European languages (count)
// S1601_C01_012E = Asian and Pacific Island languages (count)
// S1601_C01_016E = Other languages (count)
// S1601_C02_003E = % speak language other than English (pre-computed by Census)

// Helper: safe number parse 
function safe(val) {
  const n = parseFloat(val);
  return isNaN(n) || n < 0 ? 0 : n;
}

// Process tract 
const results = dataRows.map(row => {
  // Strip the GEO_ID prefix to get the plain GEOID (matches GeoJSON)
  const geoid = row["GEO_ID"].replace("1400000US", "");

  const total        = safe(row["S1601_C01_001E"]);
  const nonEnglish   = safe(row["S1601_C01_003E"]);
  const spanish      = safe(row["S1601_C01_004E"]);
  const indoEuropean = safe(row["S1601_C01_008E"]);
  const asian        = safe(row["S1601_C01_012E"]);
  const other        = safe(row["S1601_C01_016E"]);

  const nonEnglishPct = total > 0
    ? +(nonEnglish / total * 100).toFixed(1)
    : 0;

  const languages = { spanish, indoEuropean, asian, other };

  // Compute top 3 languages for popup
  const top3 = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .filter(([, count]) => count > 0)
    .map(([lang, count]) => ({
      lang,
      count: Math.round(count),
      pct: total > 0 ? +(count / total * 100).toFixed(1) : 0,
    }));

  return {
    geoid,
    name:  row["NAME"],
    total: Math.round(total),
    nonEnglish:    Math.round(nonEnglish),
    nonEnglishPct,
    languages: {
      spanish:      Math.round(spanish),
      indoEuropean: Math.round(indoEuropean),
      asian:        Math.round(asian),
      other:        Math.round(other),
    },
    top3,
  };
});


fs.writeFileSync("data.json", JSON.stringify(results, null, 2));
console.log(`Saved ${results.length} tracts to data.json ✓`);



//TESTER Function
function test(){
  const s = results[95];
  console.log("\nSample tract:", s.name);
  console.log("  Total:          ", s.total);
  console.log("  Non-English %:  ", s.nonEnglishPct);
  console.log("  Top 3:          ", s.top3);
}

test();