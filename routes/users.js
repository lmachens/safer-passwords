const express = require("express");

function createUsersRouter(database) {
  const router = express.Router();

  router.post("/login", async (request, response) => {
    const { email, password } = request.body;
    console.log(email, password);
    response.send("Logged in");
  });

  return router;
}

module.exports = createUsersRouter;
