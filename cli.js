const inquirer = require("inquirer");
const fs = require("fs").promises;

const CHOICE_GET = "Read a password";
const CHOICE_SET = "Set a password";

const questionsStart = [
  {
    type: "password",
    name: "masterPassword",
    message: "What's your master password?",
  },
  {
    type: "list",
    name: "action",
    message: "What do you want to do?",
    choices: [CHOICE_GET, CHOICE_SET],
  },
];

const questionsGet = [
  {
    type: "input",
    name: "key",
    message: "Which password do you need?",
  },
];

const questionsSet = [
  {
    type: "input",
    name: "key",
    message: "Which password do you like to set?",
  },
  {
    type: "password",
    name: "password",
    message: "Please enter the password 😎",
  },
];

inquirer.prompt(questionsStart).then(async ({ masterPassword, action }) => {
  if (masterPassword === "123") {
    console.log("Master Password is correct!");
    if (action === CHOICE_GET) {
      console.log("Now Get a password");
      inquirer.prompt(questionsGet).then(async ({ key }) => {
        try {
          const passwordsJSON = await fs.readFile("./passwords.json", "utf-8");
          const passwords = JSON.parse(passwordsJSON);
          console.log(`Your ${key} password is ${passwords[key]}`);
        } catch (error) {
          console.error("Something went wrong 😑");
          // What to do now?
        }
      });
    } else if (action === CHOICE_SET) {
      console.log("Now Set a password");
      inquirer.prompt(questionsSet).then(async ({ key, password }) => {
        console.log(`New Password: ${key} = ${password}`);
      });
    }
  } else {
    console.log("Master Password is incorrect!");
  }
});
