require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const { readPassword } = require("./lib/passwords");
const { decrypt } = require("./lib/crypto");

const client = new MongoClient(process.env.MONGO_URI, {
  useUnifiedTopology: true,
});

const app = express();

const port = 3000;

async function main() {
  await client.connect();
  const database = client.db(process.env.MONGO_DB_NAME);
  const masterPassword = process.env.MASTER_PASSWORD;

  app.get("/api/passwords/wifi", async (request, response) => {
    const key = "wifi";
    const encryptedPassword = await readPassword(key, database);
    const password = decrypt(encryptedPassword, masterPassword);

    response.send(password);
  });

  app.post("/api/passwords", (request, response) => {
    response.send("123");
  });

  app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
  });

  app.listen(port, () => {
    console.log(`Ready! App is listening on http://localhost:${port}`);
  });
}

main();
