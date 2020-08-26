const fs = require("fs").promises;

async function readPasswords() {
  const passwordsJSON = await fs.readFile("./passwords.json", "utf-8");
  const passwords = JSON.parse(passwordsJSON);
  return passwords;
}

async function writePasswords(passwords) {
  const passwordsJSON = JSON.stringify(passwords, null, 2);
  await fs.writeFile("./passwords.json", passwordsJSON);
}

async function readPassword(key) {
  const passwords = await readPasswords();
  const password = passwords[key];
  return password;
}

async function writePassword(key, value) {
  const passwords = await readPasswords();
  passwords[key] = value;
  await writePasswords(passwords);
}

async function readMasterPassword() {
  const masterPassword = await fs.readFile("./masterPassword", "utf-8");
  return masterPassword;
}

exports.readPassword = readPassword;
exports.writePassword = writePassword;
exports.readMasterPassword = readMasterPassword;
