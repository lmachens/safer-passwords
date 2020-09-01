const express = require("express");
const { readPassword, writePassword } = require("../lib/passwords");
const { decrypt, encrypt } = require("../lib/crypto");
const jwt = require("jsonwebtoken");

function createPasswordsRouter(database, masterPassword) {
  const router = express.Router();

  router.get("/:name", async (request, response) => {
    try {
      const { name } = request.params;
      const { authToken } = request.cookies;

      const { email } = jwt.verify(authToken, process.env.JWT_SECRET);
      console.log(`Allow access to ${email}`);

      const encryptedPassword = await readPassword(name, database);
      if (!encryptedPassword) {
        response.status(404).send(`Password ${name} not found`);
        return;
      }
      const password = decrypt(encryptedPassword, masterPassword);

      response.send(password);
    } catch (error) {
      console.error(error);
      response.status(500).send(error.message);
    }
  });

  router.post("/", async (request, response) => {
    try {
      const { name, value } = request.body;

      const existingPassword = await readPassword(name, database);
      if (existingPassword) {
        response.status(409).send("Password already exists");
        return;
      }

      const encryptedPassword = encrypt(value, masterPassword);
      await writePassword(name, encryptedPassword, database);
      response.status(201).send(`Password ${name} created`);
    } catch (error) {
      console.error(error);
      response.status(500).send(error.message);
    }
  });

  return router;
}

module.exports = createPasswordsRouter;
