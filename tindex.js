const trakt = require('./scripts/trakt');

async function main() {
    var jj = await trakt.fetchData();
    console.log(jj);
}

(async() => {
    await main();
})();