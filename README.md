# Seedifyuba backend payments
Backend of payments and smart contract of seedyfiuba application.

## Local & Heroku configurations
The following environment variables should be set before building the server:
- `MNEMONIC`: A 12 words phrase asociated to an existent wallet in the current network (local network or kovan network)
- `INFURA_API_KEY`: The api key to access ethereum network throught Infura nodes.
- `API_KEY`: The api key to access server endpoints
- `DATABASE_URL`: The url of the postgres database which the server will use to persist data.
- `GATEWAY_URL`: The only URL which will have access to server endpoints in CORS.

Most of these environment variable could be set in docker-compose.yml (for local development) or in Heroku settings.

The environment variables with special configuration are describe in the following sections.

#### MNEMONIC and INFURA_API_KEY
These environment variables must be set in a `.env` file in the root directory.

ATTENTION: The `.env` file must NOT be pushed to remote repository.

A new MNEMONIC for testing in local network can be created looking at the test `New wallet should have a mnemonic phrase` described in `/backend-payments/test/1_ethersLib/ethersLibTest.js`.

The infura api key will not be used in local development, but it still needs to be specified in order to build the containers succesfully.

#### DATABASE_URL
This environment variable is automatically set by Heroku when using Postgres database add-on.

### Only Heroku
Moreover, in herkou should be set the following environment variables:
- `DD_API_KEY`: The api key to send logs from Heroku to Datadog service
- `DD_APM_ENABLED`: Should be set to `true`.
- `DD_DOGSTATSD_NON_LOCAL_TRAFFIC`: Should be set to `true`.
- `DD_DYNO_HOST`: Should be set to `false`.

## Local environment

### Build
```
DOCKER_BUILDKIT=1 docker-compose build
```

Note: The environment variable `DOCKER_BUILDKIT` set to 1, allows the utilization of
additional tools of Docker engine. One of these tools is the
`<Dockerfile name>.dockerignore` files like, which are used to ignore files and
folders while building containers whose dockerfile exists in the same directory.

### Start services
```
docker-compose up [-d]
```
This command will start the next services:
- `sc`: It is a service of hardhat's nodes where the smart contract is deployed.
- `db`: It is the postgres database for developing and testing. Due to a lack of time, we did not set two different databases.
- `web`: It is the backend payments service which needs to interact with:
  - the smart contract through the `sc` service
  - the database through the `db` service

The `web` service will wait until a file deployments/localhost/Seedifyuba.json exists,
to start up. This file is created for the first time when `sc` service is executed. When
these services are stopped but not destroyed, then this file will be kept in containers
shared volume, so `web` will not wait again for `sc` to start. This is only useful when
pushing code to the repository where pipeline build containers from cero. Locally, we will
have to wait for it looking (with our eyes) at the services logs.

### Web (web container)

#### Test
```
docker-compose exec web npm test
```
Note 1: Tests are not isolated from each other :(
This means that all test interact with the same db and with the same hardhat node.
As a consecuence, tests should recreate db before running.
Another more important consecuence is that all test should share the same wallet for testing,
which means that we have a limitated amount of weis (ethers) to distribute among all tests.

Note 2: Executing a transaction costs additional ethers to those sent in the same one.

### Postgres DB (db container)
#### Open CLI
```
docker-compose exec db psql -U postgres
```
Note: `postgres` is the user defined in `docker-compose.yml` file while creating the container for this database.

#### CLI commands
- `\l`: list all databases.
- `\c <name of db>`: connect to specific database.
- `\dt`: display all relation inside the current database to which we are connected.

##### Queries
When connected to a certain DB you should write SQL queries to get data.
For example:
```
SELECT * FROM wallets;
```

### Stop
```
docker-compose stop
```

### Destroy
```
docker-compose down -v
```

### Smart-contract (sc container)
Open a /bin/bash/ terminal like this:
```
docker-compose exec sc /bin/bash
```
Note: The sc service should be up.

Use this terminal to run the following commands.

#### Testing

`npm test`

#### Linting

To run the linter, after you installed the dependencies, just run

`npm run lint`

#### Coverage

To create a coverage report, after you installed the dependencies, just run

`npm run coverage`

#### Doc generation

To create the smart contract documentation, after you installed the dependencies, just run

`npm run docgen`

This will generate a browsable html file within the `./docs` folder, to view it you can open it with any browser.

#### Deployment

To deploy the smart contracts just run

`npm run deploy-kovan`

`npm run deploy-local`

depending on the network you want to use.

To get the deployed contract address just look in the `deployments/<network>/Seedifyuba.json` file.

Note: Different instances of the container may deploy new contracts with the same INFURA KEY and MEMONIC in Kovan network.

#### More scripts

Other useful scripts can be found using

`npm run`


## Heroku Environment

Heroku app's name (App): seedy-fiuba-backend-payments
Heroku repository's name: https://git.heroku.com/seedy-fiuba-backend-payments.git

Heroku Postgres (BDD): postgresql-transparent-72738
(La aplicación desplegada en Heroku utiliza una base de datos Postgres propia de la plataforma, agregada como add-on de la aplicacion)

App's url: https://seedy-fiuba-backend-payments.herokuapp.com/

### Environment variables
- `DATABASE_URL`: It is set up `automatically` when adding `Heroku Postgres` add-on to this app.
- `GATEWAY_URL`: It must be set up `manually` with Gateway service's URL which will be the only service
able to interact with the current service (CORS). (Note: curl, postman, etc request will still work)

### Deployment
Connect to Heroku:
```
heroku login
```

Add Heroku's remote repository:
```
heroku git:remote -a seedy-fiuba-backend-payments
```
Note: Heoku app's creator should lend collaborator access to it before pushing any image.

Connect to Heroku's container:
```
heroku container:login
```

Build app's image and push to Heroku's container:
```
heroku container:push web --app seedy-fiuba-backend-payments
```

Release recently pushed app's image to Heroku execution environment:
```
heroku container:release web --app seedy-fiuba-backend-payments
```

### Up / Down service
Up service:
```
heroku ps:scale web=1 --app seedy-fiuba-backend-payments
```

Down service:
```
heroku ps:scale web=0 --app seedy-fiuba-backend-payments
```

### Postgres psql
```
heroku pg:psql --app seedy-fiuba-backend-payments
```

## Local & Heroku migrations
"Migrations" are triggered when app's starts:
`backend-payments/src/server.js`
```
(...)
db.sync({alter: true}) (...)
(...)
```
This line of code will tell postgres database to create unexistent tables and
modify existent tables so they match with current database relations defined in
`backend-payments/src/db/models/`

This is not the correct way to do migrations. Migrations should be triggered manually
some administrator, and it should exists a folder with every migration made to be able
rollback if anything breaks.

We did not follow the "nice" way of migrations due to lack of time.
