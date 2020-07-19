const fs = require("fs");
const csv = require("csvtojson");
const Geocodio = require("geocodio-library-node");
const dotenv = require("dotenv");
dotenv.config(); // read env vars from .env

// todo: move these to script options
const inputFilePath = "./src_data/ncvoter11.txt";
const zipCode = "28806";
const partyAffCode = "DEM"; // UNA, DEM, REP, LIB
const outputFilePath = "./src/voters.json";

// group an input array into chunked arrays
// https://scotch.io/courses/the-ultimate-guide-to-javascript-algorithms/array-chunking
function chunkArray(array, size) {
  let result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function batchGeolocate(voterData) {
  console.log("Batch GeoLocating Results");
  const votersWithLocation = [];
  const geocoder = new Geocodio(process.env.GEOCOD_API_KEY);
  // 10,000 is the bulk geocoding limit for Geocodio
  //  https://www.geocod.io/docs/?shell#batch-geocoding
  const chunkedVoterData = chunkArray(voterData, 10000);
  // for each chunk, batch call and wait for results for next chunk
  for (const batch of chunkedVoterData) {
    console.log(`Batch geocoding ${batch.length} items.`);
    const { results: geolocationResults } = await geocoder.geocode(
      // reduce json items to batchable addresses
      batch.reduce(
        (batchPayload, voter) => ({
          ...batchPayload,
          [voter.id]: `${voter.streetAddress}, ${voter.city} ${voter.state} ${voter.zipCode}`,
        }),
        {}
      )
    );
    // find first result with accuracy greater then 0.8
    Object.keys(geolocationResults).forEach((key) => {
      // todo: possibly include accuracy criteria instead of just first result
      const result = geolocationResults[key].response.results[0];
      // find json item and insert location result
      const voter = voterData.find((data) => data.id === Number(key));
      votersWithLocation.push({
        ...voter,
        location: result.location,
      });
    });
  }
  return votersWithLocation;
}

function processCsv() {
  console.log("Open csv file and filter");
  const voterData = [];

  // open csv file, subscribe to each row and format, on complete gelocate addresses
  csv({
    delimiter: "\t",
  })
    .fromFile(inputFilePath)
    .subscribe((json, index) => {
      if (
        json.voter_status_desc === "ACTIVE" &&
        json.zip_code === zipCode &&
        json.party_cd === partyAffCode
      ) {
        voterData.push({
          id: index, // id will be used in Geolocation
          firstName: json.first_name.toLowerCase(),
          lastName: json.last_name.toLowerCase(),
          streetAddress: json.res_street_address.toLowerCase(),
          city: json.res_city_desc.toLowerCase(),
          state: json.state_cd,
          zipCode: json.zip_code,
          raceCode: json.race_code,
          ethnicCode: json.ethnic_code,
          partyAffiliation: json.party_cd,
          gender: json.gender_code,
          age: json.birth_age,
        });
      }
    })
    .on("done", async (error) => {
      if (error) {
        console.log(error);
      } else {
        const votersWithLocation = await batchGeolocate(voterData);
        // write JSON as string to a file
        fs.writeFileSync(outputFilePath, JSON.stringify(votersWithLocation));
      }
    });
}

processCsv();
