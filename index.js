const trakt = require('./scripts/trakt');
const waka = require('./scripts/waka');
const rescue = require('./scripts/rescue');

async function main() {
    // var jj = await trakt.fetchData();
    // console.log(jj);

    //WAKA ARCHIVER WILL WORK BASED ON THE CRON SCHEDULE WHICH IS EVERY SUNDAY (ARCHIVING LAST 7 DAYS DATA)
    waka();

    //RESCUE ARCHIVER NEEDS TO BE RUN ONLY ONCE A MONTH
    var today = new Date();
    var weekNumber = parseInt(today.getDate() / 7);
    if (weekNumber === 0) {
        rescue(); //will archive the last months data
    }
}

(async() => {
    await main();
})();