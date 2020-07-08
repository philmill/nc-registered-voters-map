const fs = require('fs');
const csv = require('csvtojson');
console.log('open csv');

const zipCode = '28806';
const partyAffCode = 'DEM'; // UNA, DEM, REP, LIB

const output = []

csv({
  delimiter:'\t'
})
  .fromFile('./src_data/ncvoter11.txt')
  .subscribe((json,index) => {
    if (
      json.voter_status_desc === 'ACTIVE'
      && json.zip_code === zipCode
      && json.party_cd === partyAffCode
    ) {
      output.push({
        firstName: json.first_name,
        lastName: json.last_name,
        streetAddress: json.res_street_address,
        city: json.res_city_desc,
        state: json.state_cd,
        zipCode: json.zip_code,
        raceCode: json.race_code,
        ethnicCode: json.ethnic_code,
        partyAffiliation: json.party_cd,
        gender: json.gender_code,
        age: json.birth_age,
      })
    }
  })
  .on('done',(error)=>{
    console.log('Writing results to file');
    if (error) {
      console.log(error)
    } else {
      fs.writeFileSync('voters.json', JSON.stringify(output));
    }
  })
