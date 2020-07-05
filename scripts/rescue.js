require('dotenv').config();
const fetch = require("node-fetch");
var urllib = require('urllib');
const gdrive = require('./drive');
var fs = require('fs');

const rescueKey = process.env.RESCUE;
const baseURL = "https://www.rescuetime.com/anapi/data";

module.exports = async function exportRescue() {

    //calculating the data
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let lastDayOfMonth =  new Date(2008, month, 0);
    let lastDate = lastDayOfMonth.getDate();

    let dateStart = year + "-" + month + "-" + "1";
    let dateEnd = year + "-" + month + "-" + `${lastDate}`;

    let rescueUrl = baseURL + `?key=${rescueKey}&perspective=interval&restrict_begin=${dateStart}&restrict_end=${dateEnd}&format=csv`;

    fetchAndUpload(rescueUrl);
}


async function fetchAndUpload(API_END) {
    console.log(API_END);
    try {
        urllib.request(API_END, {timeout: 10000}, function(err, data, res) {
            if (err) {
                throw err; // you need to handle error
            }
            var csv = data.toString();
            uploadToDrive(csv);
        });

    } catch (error) {
        console.error(`waka ran into an issue getting your waka data:\n${error}`);
    }
}


function saveFile(csv) {
    fs.writeFile('rescue.csv', csv, 'utf8', function(err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        } else {
            console.log('It\'s saved!');
        }
    });
};

function uploadToDrive(csv) {
    console.log("RescueTime CSV successfully converted");

    console.log(csv);
    gdrive.upload({ 'csv': csv, 'type': 'RESCUE' });
}
