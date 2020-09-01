const express = require("express");
const {
  readPassword,
  writePassword,
  updatePassword,
} = require("../lib/passwords");
const { decrypt, encrypt } = require("../lib/crypto");
const jwt = require("jsonwebtoken");

function createPasswordsRouter(database, masterPassword) {
  const router = express.Router();

  router.use((request, response, next) => {
    try {
      const { authToken } = request.cookies;

      const { email } = jwt.verify(authToken, process.env.JWT_SECRET);
      console.log(`Allow access to ${email}`);
      next();
    } catch (error) {
      response.status(401).send("No access!!");
    }
  });

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

  router.patch("/:name", async (request, response) => {
    try {
      const { name } = request.params;
      const { name: newName, value: newValue } = request.body;

      const existingPassword = await readPassword(name, database);
      if (!existingPassword) {
        response.status(404).send("Password doesn't exists");
        return;
      }

      // if (newName && newValue) {
      //   updatePassword(
      //     newName,
      //     encrypt(newValue, masterPassword),
      //     database
      //   );
      // } else if (newName) {
      //   updatePassword(
      //     newName,
      //     existingPassword,
      //     database
      //   );
      // } else if (newValue) {
      //   updatePassword(
      //     name,
      //     encrypt(newValue, masterPassword),
      //     database
      //   );
      // }

      await updatePassword(
        newName || name,
        newValue ? encrypt(newValue, masterPassword) : existingPassword,
        database
      );

      response.status(200).send("Password updated");
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
