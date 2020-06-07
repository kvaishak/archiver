# Archiver
Used for automatically archiving data from various 3rd Party Sources to Google Drive

## Services supported 
* Wakatime
* Rescuetime
* Trakt

## Steps
1. Clone the repository.
2. Copy `.env-sample` to `.env` and populate the contents as required for local testing.
3. For Github automation same values must be populated in GitHub secrets.
3. Modify the CRON timings as per your requirement.
4. Whenever anything is changed or as per the CRON schedule, the job will be executed.


### Wakatime
* Only wakatime username is required for getting weekly data.
* Optionally you can fill the `Activity URL` which is got from the wakatime Share menu.

### Rescuetime
* Rescue time API key needed.

### Trakt
**NOTE** : Trakt exports entire user data, so its advisable not to add it in CRON action. You can run it manually in local machine. Since trakt doesn't delete user data after certain interval, its not much of an issue.
* Trakt API key needed.
* Trakt User name.
* Optional - By default trakt fetches the stat of the user. For getting complete data about movies/shows, fill in TRAKT_TYPE with "movies"/"shows" respectively.

### Google Drive
**Note** : Follow the instructions from this [page](https://developers.google.com/drive/api/v3/quickstart/nodejs) to setup connection to your google drive.

* Run the code initially in local machine to get all the required keys for google drive API. 
* Once that is done, and .env/Github Secrets has been populated. It's ready for CRON job.
* GDrive folder is optional. Will default to ROOT directory