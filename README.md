# Biblio Test App

This project is a sample Next.js application backed by MongoDB. It includes simple API routes, an example data model, and unit tests.

## Installation

1. Install Node dependencies:

```bash
npm install
```

2. (Optional) Set environment variables as needed. The default configuration expects MongoDB at `mongodb://localhost:27017/bibliodb`.

## Running the Development Server

Start the application in development mode with:

```bash
npm run dev
```

The server runs on http://localhost:3000/ by default.

## Executing Tests
install Jest with: 
    npm i -D jest

Run Jest tests with:

```bash
npm test
```
This command runs all unit, system, and end-to-end tests.


To run all tests manually, including the new system test that uses `pg-mem`, you can run:

```bash
npx cross-env NODE_OPTIONS=--experimental-vm-modules jest __tests__
```

## Docker Compose

The repository includes a `compose.yml` that provisions both a MongoDB container and the Next.js application. Start both services with:

```bash
docker compose up
```

When the MongoDB container starts, it executes `./.docker/biblio-backend/seed.js` to populate the `bibliodb` database using `src/data/library.json`.

