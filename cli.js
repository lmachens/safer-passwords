require("dotenv").config();

const {
  askStartQuestions,
  askGetPasswordQuestions,
  askSetPasswordQuestions,
  CHOICE_GET,
  CHOICE_SET,
  askForNewMasterPassword,
} = require("./lib/questions");
const {
  readPassword,
  writePassword,
  readMasterPassword,
  writeMasterPassword,
} = require("./lib/passwords");
const { encrypt, decrypt, createHash, verifyHash } = require("./lib/crypto");
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function main() {
  try {
    await client.connect();
    const database = client.db(process.env.MONGO_DB_NAME);

    const originalMasterPassword = await readMasterPassword();
    if (!originalMasterPassword) {
      const { newMasterPassword } = await askForNewMasterPassword();
      const hashedMasterPassword = createHash(newMasterPassword);
      await writeMasterPassword(hashedMasterPassword);
      console.log("Master Password set!");
      return;
    }

    const { masterPassword, action } = await askStartQuestions();

    if (!verifyHash(masterPassword, originalMasterPassword)) {
      console.log("Master Password is incorrect!");
      return;
    }

    console.log("Master Password is correct!");
    if (action === CHOICE_GET) {
      console.log("Now Get a password");
      const { key } = await askGetPasswordQuestions();
      try {
        const encryptedPassword = await readPassword(key, database);
        const password = decrypt(encryptedPassword, masterPassword);

        console.log(`Your ${key} password is ${password}`);
      } catch (error) {
        console.error("Something went wrong 😑", error);
        // What to do now?
      }
    } else if (action === CHOICE_SET) {
      console.log("Now Set a password");
      try {
        const { key, password } = await askSetPasswordQuestions();
        const encryptedPassword = encrypt(password, masterPassword);
        await writePassword(key, encryptedPassword, database);
        console.log(`New Password set`);
      } catch (error) {
        console.error("Something went wrong 😑");
        // What to do now?
      }
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

main();
