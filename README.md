# Disclaimer

This is a project in order to experiment with express.js and vue.js.

# Setup

1. Install nodejs and npm

2. Install the SQLite client. For example, on Ubuntu:
```shell
sudo apt install sqlite3
```

3. Open two terminal windows, one for the backend and one for the frontend and follow the instructions below for each one

## Backend

1. Change directory to `server/`

2. Initialize your database:
```shell
DBSOURCE=db.sqlite3 ./init-db.sh
```

*NOTE:* In order to reset the database, just delete `db.sqlite3` and rerun the `init-db.sh` script

3. Create a `.env` file in the root directory with the following values:
```shell
PORT=8000
DBSOURCE=db.sqlite3
ADMIN_PASSWORD=some-very-secret-value
```

4. Install the dependencies:
```shell
npm install
```

5. Build the server:
```shell
npm run build
```

6. Run the server:
```shell
npm run start
```

## Frontend

1. Change directory to `client/`

2. Install the dependencies:
```shell
npm install
```

3. Run the server:
```shell
npm run serve
```

# Usage

* Navigate to `Conversion` in order to use the currency conversion calculator
* Navigate to `Exchange Rates Create Update` in order to add a new exchange rate between two currencies or modify an existing one. There's only one user that can perform these actions, `admin`, and the password is the one that was set back at the backend setup (`ADMIN_PASSWORD` in the `.env` file)
