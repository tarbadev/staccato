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
Run `yarn cypress:run`  
This will run the E2E tests on Electron headless  

For more control, run `yarn cypress:open`

## Database Migration
### Create a Migration file
- Stop the server if it is running
- `cd server`
- `yarn ts-node ../node_modules/.bin/typeorm migration:create -f ../config/local.database.config.ts -n <name>`
- Modify the generated script under `./server/migrations`. Follow [this link](https://typeorm.io/#/migrations) to see the QueryRunner API
- Start the server and verify migration 

## Deployment to Kubernetes
### Mysql deployment
- Create secret for mysql password: `kubectl create secret generic mysql-secret --from-literal=password=<PASSWORD>`
- Run script: `./kubernetes/deployMysql.sh`
- Setup mysql DB and user:
    ```bash
  kubectl exec <MYSQL_SERVER_POD_NAME> --stdin --tty -- /bin/bash
  mysql -u root -p
  create database staccato;
  CREATE USER 'staccato'@'%' IDENTIFIED BY '<PASSWORD>';
  GRANT ALL PRIVILEGES ON staccato.* TO 'staccato'@'%';
  exit # Quit mysql
  exit # Quit bash
    ```
### Staccato deployment
- Create secret for drive credentials: `kubectl create secret generic staccato-drive-config --from-file=<PATH>/drive-credentials.json`
- Run script: `./kubernetes/deployStaccato.sh`
