# Seedifyuba - New documentation
Smart contract and basic service to solve payments in the seedifyuba project.

## Local environment

### Pre-build
You should create a `.env` file following instructions describe in the `Original Documentation`.
If you are a member of SeedyFiuba organization, you could use MNEMONIC and INFURA_API_KEY defined in `Github Repository Secrets`.
A new MNEMONIC can be created looking at the test `New wallet should have a mnemonic phrase` described in `/backend-payments/test/1_ethersLib/ethersLibTest.js`.

### Build
```
DOCKER_BUILDKIT=1 docker-compose build
```

Note: The environment variable DOCKER_BUILDKIT set to 1, allows the utilization of
additional tools of Docker engine. One of these tools is the
`<Dockerfile name>.dockerignore` files like, which are used to ignore files and
folders while building containers whose dockerfile exists in the same directory.

### Start services
```
docker-compose up [-d]
```
This command will start the next services:
- `sc`: It is a service of hardhat's nodes where the smart contract is deployed.
- `db`: It is the postgres database for developing.
- `web`: It is the backend payments service which needs to interact with:
  - the smart contract through the `sc` service
  - the database through the `db` service

The `web` service will wait until a file deployments/localhost/Seedifyuba.json exists,
to start up. This file is created for the first time when `sc` service is executed. When
these services are stopped but not destroyed, then this file will be kept in containers
shared volume, so `web` will not wait again for `sc` to start. This is only useful when
pushing code to the repository where pipeline build containers from cero. Locally, we will
have to wait for it looking (with our eyes) at the services logs.

### Test
#### Test backend payments
```
docker-compose exec web npm test
```
Note 1: Tests are not isolated from each other :(
This means that all test interact with the same db and with the same hardhat node.
As a consecuence, tests should recreate db before running.
Another more important consecuence is that all test should share the same wallet for testing,
which means that we have a limitated amount of weis (ethers) to distribute among all tests.

Note 2: Executing a transaction costs additional ethers to those sent in the same one.

#### Test Smart-contract
```
docker-compose exec hh_node npm test
```

### Postgres DB
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

## Up / Down service
Up service:
```
heroku ps:scale web=1 --app seedy-fiuba-backend-payments
```

Down service:
```
heroku ps:scale web=0 --app seedy-fiuba-backend-payments
```

## Postgres psql
```
heroku pg:psql --app seedy-fiuba-backend-payments
```

## Migrations (both environments)
"Migrations" are triggered when app's starts:
`backend-payments/src/server.js`
```
(...)
await db.sync({alter: true});
(...)
```
This line of code will tell postgres database to create unexistent tables and
modify existent tables so they match with current database relations defined in
`backend-payments/src/db/models/`

This is not the correct way to do migrations. Migrations should be triggered manually
some administrator, and it should exists a folder with every migration made to be able
rollback if anything breaks.

We did not follow the "nice" way of migrations due to lack of time.


## Smart-contract

Follow steps described in the Original Documentation but execute commands from `sc` docker container.

### Notes
Different instances of the container may deploy new contracts with the same INFURA KEY and MEMONIC in Kovan net.

# Seedifyuba - Original documentation

## Installation

To install the project we recommend that you use NVM and install the node version defined in `.nvmrc`

Once you have that in place, you can install the dependencies with npm through

`npm i`

## Seedifyuba - Service

This is a minimum project that will serve as a guide to help students to do the rest of the integration

### Start process

To start the process, after you installed the dependencies and deployed the smart contracts to Kovan, you can run

`npm start`

keep in mind that you should have everything in config set before that.

### Available endpoints

The following endpoints are available:

- Create wallet: POST /wallets - No body
- Get wallets: GET /wallets
- Get wallet: GET /wallets/:id:
- Create project: POST /projects - Body params: reviewerId(integer), ownerId(integer), stagesCost(array of numbers)
- Get project: GET /projects/:hash:

### Usage example

```sh
$ http POST http://localhost:5002/wallets
HTTP/1.1 200 OK
Connection: keep-alive
Date: Fri, 16 Apr 2021 02:05:45 GMT
Keep-Alive: timeout=5
content-length: 145
content-type: application/json; charset=utf-8

{
    "address": "0xA3A9D25d69A00F17AA7a7DE96fA6729655cFB463",
    "id": 3,
    "privateKey": "0xb9444636faac0ab28ac177c767fa434d7c0767d1b3019d980e079a4d644727ba"
}

$ http POST http://localhost:5002/wallets
HTTP/1.1 200 OK
Connection: keep-alive
Date: Fri, 16 Apr 2021 02:05:46 GMT
Keep-Alive: timeout=5
content-length: 145
content-type: application/json; charset=utf-8

{
    "address": "0x5228DA7727a15904FaF8c98194f710AcD932dba9",
    "id": 4,
    "privateKey": "0x6906bdfcebf1e2366d3c32aa001b0b7e882f719daabe590650f854279979c62e"
}

$ http POST http://localhost:5002/projects ownerId=1 reviewerId=2 stagesCost:='[10,20,10]'
HTTP/1.1 200 OK
Connection: keep-alive
Date: Fri, 16 Apr 2021 02:07:07 GMT
Keep-Alive: timeout=5
content-length: 981
content-type: application/json; charset=utf-8

{
    "chainId": 42,
    "data": "0xd86233940000000000000000000000000000000000000000000000000000000000000060000000000000000000000000f018be4fe4fbd4ca1b1162a44bb139a343c2087b00000000000000000000000019544c4b8ce1c08c81bb67c4075265d967935dcd00000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000001158e460913d000000000000000000000000000000000000000000000000000008ac7230489e80000",
    "from": "0x55B86Ea5ff4bb1E674BCbBe098322C7dD3f294BE",
    "gasLimit": {
        "hex": "0x02ba56",
        "type": "BigNumber"
    },
    "gasPrice": {
        "hex": "0x02d1375900",
        "type": "BigNumber"
    },
    "hash": "0x30b003c570eccaf1705acd4621f72993acb51715f8decbf61535f21376cfe1d2",
    "nonce": 19,
    "r": "0xd06642b8b98b120829d24cc654b6ae9a22a16c31aa9e714c8f5306befe01cd3f",
    "s": "0x5ad6c768417a99aa63f9a2e2aa3f493db601d9e317922535fb6c54f8cdc0fba9",
    "to": "0xD0436D8e93df9c543eFd2c04152393A8D05B5A05",
    "type": null,
    "v": 119,
    "value": {
        "hex": "0x00",
        "type": "BigNumber"
    }
}

$ http GET http://localhost:5002/projects/0x30b003c570eccaf1705acd4621f72993acb51715f8decbf61535f21376cfe1d2
HTTP/1.1 200 OK
Connection: keep-alive
Date: Fri, 16 Apr 2021 02:09:27 GMT
Keep-Alive: timeout=5
content-length: 177
content-type: application/json; charset=utf-8

{
    "projectId": 16,
    "projectOwnerAddress": "0xf018Be4Fe4fBD4cA1B1162A44bB139a343C2087b",
    "projectReviewerAddress": "0x19544c4b8ce1c08c81bb67C4075265D967935DCd",
    "stagesCost": [
        10,
        20,
        10
    ]
}

```

## Seedifyuba - SC

This project is a smart contract made for the subject `Taller de programacion 2` of the `FIUBA`. The project allows social entepreneurs to create projects that other users funds while enabling the funders to track that the funds actually reach the destination which they intended, there is also a reviewer of the project which ensures that the project is going good and is the one in charge of releasing the funds.

### Usage



#### Testing

To run the tests, after you installed the dependencies, just run

`npm t`

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

Keep in mind that you have to set the INFURA_API_KEY and MNEMONIC envvars(the .env file can be used for this).

To get the deployed contract address just look in the `deployments/<network>/Seedifyuba.json` file.

#### More scripts

Other useful scripts can be found using

`npm run`
