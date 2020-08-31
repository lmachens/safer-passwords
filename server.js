require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const createPasswordsRouter = require("./routes/passwords");

const client = new MongoClient(process.env.MONGO_URI, {
  useUnifiedTopology: true,
});

const app = express();

const port = 3000;

async function main() {
  await client.connect();
  const database = client.db(process.env.MONGO_DB_NAME);
  const masterPassword = process.env.MASTER_PASSWORD;

  app.use(bodyParser.json());

  app.use((request, response, next) => {
    console.log(`Request ${request.method} on ${request.url}`);
    next();
  });

  app.use("/api/passwords", createPasswordsRouter(database, masterPassword));

  app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
  });

  app.listen(port, () => {
    console.log(`Ready! App is listening on http://localhost:${port}`);
  });
}

main();
