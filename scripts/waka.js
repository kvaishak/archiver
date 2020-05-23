const converter = require('json-2-csv');
require('dotenv').config();
var fs = require('fs');
const fetch = require("node-fetch");
const gdrive = require('./drive')
const activityUrl = process.env.WAKA_ACTIVITY_URL;
const languageUrl = process.env.WAKA_LANG_URL;
const editorUrl = process.env.WAKA_EDITOR_URL;

module.exports = async function exportWaka() {

    console.log(activityUrl);
    console.log(languageUrl);
    console.log(editorUrl);

    //fetching and converting the activity data
    let wakaActivity = await fetchData(activityUrl);
    converter.json2csv(wakaActivity.data, uploadActivity, {
        prependHeader: true // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
    });

    // let wakaLanguage = await fetchData(languageUrl);
    // converter.json2csv(wakaLanguage.data, uploadLanguage, {
    //     prependHeader: true // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
    // });

    // let wakaEditor = await fetchData(editorUrl);
    // converter.json2csv(wakaEditor.data, uploadEditor, {
    //     prependHeader: true // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
    // });
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