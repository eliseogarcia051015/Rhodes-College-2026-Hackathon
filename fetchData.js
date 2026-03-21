//fetches census API, recieves  raw data, cleans it up, saves info into .js
import fs from "fs";

//REST API endpoint from the U.S. Census Bureau.
const BASE = "https://api.census.gov/data/2022/acs/acs5";

const VARS = [
  "NAME",
  "B16001_001E", // Total population 5+ years old (denominator)
  "B16001_004E", // Spanish
  "B16001_007E", // French / Haitian Creole / Cajun
  "B16001_019E", // Chinese (Mandarin, Cantonese, etc.)
  "B16001_022E", // Vietnamese
  "B16001_028E", // Arabic
  "B16001_031E", // Hindi
].join(",");

// State 47 = Tennessee, County 157 = Shelby County (Memphis)
const url = `${BASE}?get=${VARS}&for=tract:*&in=state:47+county:157`;




// Fetch main function
async function main() {
  console.log("Fetching Census data...");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Census API error: ${res.status}`);

  const raw = await res.json();
  console.log(`Total tracts returned: ${raw.length - 1}`);

  // Parse 
  const [headers, ...rows] = raw;

  // Map header names → column index for safe lookup
  const idx = Object.fromEntries(headers.map((h, i) => [h, i]));

  const tracts = rows.map((row) => {
    const total = parseInt(row[idx["B16001_001E"]]) || 0;

    const counts = {
      spanish:    parseInt(row[idx["B16001_004E"]]) || 0,
      french:     parseInt(row[idx["B16001_007E"]]) || 0,
      chinese:    parseInt(row[idx["B16001_019E"]]) || 0,
      vietnamese: parseInt(row[idx["B16001_022E"]]) || 0,
      arabic:     parseInt(row[idx["B16001_028E"]]) || 0,
      hindi:      parseInt(row[idx["B16001_031E"]]) || 0,
    };

    // Guard: Census uses -666666666 = suppressed/missing data | ai helped with this
    for (const lang in counts) {
      if (counts[lang] < 0) counts[lang] = 0;
    }

    // percentages
    const percent = {};
    for (const [lang, count] of Object.entries(counts)) {
      percent[lang] = total > 0 ? +(count / total * 100).toFixed(1) : 0;
    }

    return {
      // Join key for GeoJSON: state + county + tract = GEOID
      geoid:   row[idx["state"]] + row[idx["county"]] + row[idx["tract"]],
      tract:   row[idx["tract"]],
      county:  row[idx["county"]],
      state:   row[idx["state"]],
      name:    row[idx["NAME"]],
      total,
      counts,
      percent,
    };
  });

  // Sort by tract number so data.json is easy to read
  tracts.sort((a, b) => a.tract.localeCompare(b.tract));

  // Spot-check 
  const sample = tracts[5];
  console.log("\nSample tract:");
  console.log("  Name:      ", sample.name);
  console.log("  Total pop: ", sample.total);
  console.log("  Spanish %: ", sample.percent.spanish);
  console.log("  Arabic %:  ", sample.percent.arabic);

  // ─── Save 
  fs.writeFileSync("data.json", JSON.stringify(tracts, null, 2));
  console.log(`\nSaved ${tracts.length} tracts to data.json ✓`);
}

// test function 
async function testCensusAPI() {
    console.log("Starting API test...");

    const url = "https://api.census.gov/data/2022/acs/acs5?get=NAME,B16001_001E&for=state:47";

    console.log("Fetching from URL:");
    console.log(url);

    try {
        const response = await fetch(url);

        console.log("Did we get a response?");
        console.log(response);

        const data = await response.json();

        console.log("Raw data:");
        console.log(data);

        console.log("First row (headers):", data[0]);
        console.log("Second row (actual data):", data[1]);

    } catch (error) {
        console.log("Something went wrong:");
        console.error(error);
    }
}
//second tester function
async function exploreData() {
    console.log("---- Exploring Data ----");

    const url = "https://api.census.gov/data/2022/acs/acs5?get=NAME,B16001_001E&for=state:47";

    const response = await fetch(url);
    const data = await response.json();

    console.log("What type is this?");
    console.log(typeof data);

    console.log("How many rows?");
    console.log(data.length);

    console.log("Looping through rows:");

    for (let i = 0; i < data.length; i++) {
        console.log("Row", i, ":", data[i]);
    }
}


main();