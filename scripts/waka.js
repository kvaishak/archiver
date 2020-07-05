const converter = require('json-2-csv');
require('dotenv').config();
var fs = require('fs');
const fetch = require("node-fetch");
const gdrive = require('./drive');
const wakaActivityUrl = process.env.WAKA_ACTIVITY_URL;
const waka_name = process.env.WAKA_USERNAME;

module.exports = async function exportWaka() {

    if (waka_name) {
        let waka_url = `https://wakatime.com/api/v1/users/${waka_name}/stats/last_7_days`;
        let wakaData = await fetchData(waka_url);

        //fetching and converting the language data
        converter.json2csv(wakaData.data.languages, uploadLanguage, {
            prependHeader: true // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
        });

        //fetching and converting the editor data
        converter.json2csv(wakaData.data.editors, uploadEditor, {
            prependHeader: true // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
        });
    }


    if (wakaActivityUrl) {
        //fetching and converting the activity data
        let wakaActivity = await fetchData(wakaActivityUrl);
        converter.json2csv(wakaActivity.data, uploadActivity, {
            prependHeader: true // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
        });

    }
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



function json2csvCallbackLang(err, csv) {
    saveFile(csv, err, "Language");
}

function json2csvCallbackEditor(err, csv){
    saveFile(csv, err, "Editor");
}

function json2csvCallbackActivity(err, csv){
    saveFile(csv, err,  "Activity");
}

function saveFile(csv, err, type){
    if (err) throw err;
    fs.writeFile(`${type}.csv`, csv, 'utf8', function(err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        } else {
            console.log('It\'s saved!');
        }
    });
}

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
