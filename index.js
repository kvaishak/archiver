const trakt = require('./scripts/trakt');
const waka = require('./scripts/waka');

async function main() {
    // var jj = await trakt.fetchData();
    // console.log(jj);
    waka();
}

(async() => {
    await main();
})();