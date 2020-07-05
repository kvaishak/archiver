const trakt = require('./scripts/trakt');
const waka = require('./scripts/waka');
const rescue = require('./scripts/rescue');

async function main() {

    //TRAKT EXPORTS ENTIRE DATA FROM THE ACCOUNT. SO ITS ADVISABLE TO NOT RUN THROUGH CRON
    // trakt()

    //WAKA ARCHIVER WILL WORK BASED ON THE CRON SCHEDULE WHICH IS EVERY SUNDAY (ARCHIVING LAST 7 DAYS DATA)
    // waka();

    //RESCUE ARCHIVER NEEDS TO BE RUN ONLY ONCE A MONTH
    var today = new Date();
    var dateLength = parseInt(today.getDate().toString().length)
    if (dateLength === 1) {
        rescue(); //will archive the last months data
    }
}

(async() => {
    await main();
})();
