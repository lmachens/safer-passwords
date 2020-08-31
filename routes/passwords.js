const express = require("express");
const { readPassword, writePassword } = require("../lib/passwords");
const { decrypt, encrypt } = require("../lib/crypto");

function createPasswordsRouter(database, masterPassword) {
  const router = express.Router();

  router.get("/:name", async (request, response) => {
    try {
      const { name } = request.params;
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
