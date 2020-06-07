const converter = require('json-2-csv');
require('dotenv').config();
const fetch = require("node-fetch");
const gdrive = require('./drive');
var fs = require('fs');

const {
    TRAKT_ID: traktId,
    TRAKT_USERNAME: traktUser,
} = process.env

const API_URL = 'https://api.trakt.tv';
const type = process.env.TRAKT_TYPE ? process.env.TRAKT_TYPE : "stats"


module.exports = async function main() {

    let jsonData = await fetchData();
    console.log(jsonData);
    converter.json2csv(jsonData, uploadCSV, {
        prependHeader: true // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
    });
}

async function fetchData() {
    let endpoint = 'stats',
        API_END = `${API_URL}/users/${traktUser}/${endpoint}`;
    let mainData;

    //what data is to be fetched
    if (type === "movies") {
        API_END = `${API_URL}/users/${traktUser}/watched/movies?extended=full&limit=10000`;
    } else if (type === "shows") {
        API_END = `${API_URL}/users/${traktUser}/watched/shows?extended=full&limit=10000`;
    }


    try {
        mainData = await fetch(API_END, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-key': traktId,
                'trakt-api-version': '2',
            }
        });
        mainJson = await mainData.json();
        return mainJson;

    } catch (error) {
        console.error(`movie-box ran into an issue getting your Trakt.tv data:\n${error}`);
    }
}

//saving the csv localy
function json2csvCallback(err, csv) {
    if (err) throw err;
    fs.writeFile(`${type}.csv`, csv, 'utf8', function(err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        } else {
            console.log('It\'s saved!');
        }
    });
};


function uploadCSV(err, csv) {
    console.log("Activity CSV successfully converted");
    gdrive.upload({ 'csv': csv, 'type': 'trakt_' + type.toUpperCase() });
}