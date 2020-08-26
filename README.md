# Staccato

## Setup
### Load dependencies
Run `yarn --frozen-lockfile`

### Database Setup
Run `./server/setupDb.sh` to create the databases

### Google Drive
- Create a service account with owner access for Google Drive on the developer console
- Download the key and store it in `./config/drive-credentials.json`

## Development
### Start Dev Server with Hot Reload
Run `yarn start-dev`

### Testing
#### Unit
##### Client
- `cd client`  
- `yarn test`  
This will run the tests and watch for changes automatically
##### Server
- `cd server`  
- `yarn test`  
This will run the tests. If you want to watch for changes, run `yarn test --watch`

#### E2E
Run `yarn test-e2e`  
This will run the E2E tests on chrome headless  
If you would like to debug seeing live interactions with chrome, copy the following content into `./e2e/jest-puppeteer.config.js`
```javascript
module.exports = {
    launch: {
        headless: false,
        args: ['--window-size=1920,1080', '--no-sandbox', '--disable-setuid-sandbox'],
    },
    browserContext: 'default',
}
```

## Database Migration
### Create a Migration file
#### Option 1: Generate Migration File
- Stop the server if it is running
- `cd server`
- Modify the `*Entity.ts` class (Adding a Column, modifying a column, adding a relationship...)
- `yarn ts-node ../node_modules/.bin/typeorm migration:generate -f ../config/local.database.config.ts -n <name>`
- Modify the generated script under `./server/migrations`. Follow [this link](https://typeorm.io/#/migrations) to see the QueryRunner API
- Start the server and verify migration 
#### Option 2: Create Migration File
- Stop the server if it is running
- `cd server`
- `yarn ts-node ../node_modules/.bin/typeorm migration:create -f ../config/local.database.config.ts -n <name>`
- Modify the generated script under `./server/migrations`. Follow [this link](https://typeorm.io/#/migrations) to see the QueryRunner API
- Start the server and verify migration 