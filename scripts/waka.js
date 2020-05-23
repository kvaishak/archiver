const converter = require('json-2-csv');
require('dotenv').config();
var fs = require('fs');
const fetch = require("node-fetch");
const gdrive = require('./drive')
const activityUrl = process.env.WAKA_ACTIVITY_URL;

module.exports = async function exportWaka() {

    //fetching and converting the activity data
    myWakaData = await fetchData(activityUrl);
    converter.json2csv(myWakaData.data, uploadToDrive, {
        prependHeader: true // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
    });
}

async function fetchData(API_END) {

    let mainData;
    try {
        mainData = await fetch(API_END, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        mainJson = await mainData.json();
        return mainJson;

    } catch (error) {
        console.error(`waka ran into an issue getting your waka data:\n${error}`);
    }
}



function json2csvCallback(err, csv) {
    if (err) throw err;
    fs.writeFile('name.csv', csv, 'utf8', function(err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        } else {
            console.log('It\'s saved!');
            gdrive.upload();
        }
    });
};

function uploadToDrive(err, csv) {
    console.log("CSV data successfully converted");
    gdrive.upload(csv);
}