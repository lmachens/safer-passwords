require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

const app = express();

const port = 3000;

async function main() {
  await client.connect();

  app.listen(port, () => {
    console.log(`Bleep bloop, server is listening on port: ${port}`);
  });
}

main();
