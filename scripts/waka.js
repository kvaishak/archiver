const converter = require('json-2-csv');
require('dotenv').config();
var fs = require('fs');
const fetch = require("node-fetch");
const gdrive = require('./drive');
const waka_url = process.env.WAKA_URL;
const wakaActivityUrl = process.env.WAKA_ACTIVITY_URL


module.exports = async function exportWaka() {

    //fetching and converting the activity data
    let wakaActivity = await fetchData(wakaActivityUrl);
    converter.json2csv(wakaActivity.data, uploadActivity, {
        prependHeader: true // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
    });

    //fetching and converting the language data
    let wakaData = await fetchData(waka_url);
    converter.json2csv(wakaData.data.languages, uploadLanguage, {
        prependHeader: true // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
    });

    //fetching and converting the editor data
    converter.json2csv(wakaData.data.editors, uploadEditor, {
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
        console.log(mainJson)
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
        }
    });
};

function uploadActivity(err, csv) {
    console.log("Activity CSV successfully converted");
    gdrive.upload({ 'csv': csv, 'type': 'ACT' });
}

function uploadLanguage(err, csv) {
    console.log("Language CSV successfully converted");
    gdrive.upload({ 'csv': csv, 'type': 'LANG' });
}

function uploadEditor(err, csv) {
    console.log("Editor CSV successfully converted");
    gdrive.upload({ 'csv': csv, 'type': 'EDITOR' });
}