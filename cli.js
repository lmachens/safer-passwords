const inquirer = require("inquirer");
const fs = require("fs").promises;

const CHOICE_GET = "Read a password";
const CHOICE_SET = "Set a password";

const questionsStart = [
  {
    type: "password",
    name: "password",
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

inquirer.prompt(questionsStart).then(async (answersStart) => {
  if (answersStart.password === "123") {
    console.log("Master Password is correct!");
    if (answersStart.action === CHOICE_GET) {
      console.log("Now Get a password");
      inquirer.prompt(questionsGet).then(async (answersGet) => {
        try {
          const passwordsJSON = await fs.readFile("./passwords.json", "utf-8");
          const passwords = JSON.parse(passwordsJSON);
          console.log(
            `Your ${answersGet.key} password is ${passwords[answersGet.key]}`
          );
        } catch (error) {
          console.error("Something went wrong 😑");
          // What to do now?
        }
      });
    } else if (answersStart.action === CHOICE_SET) {
      console.log("Now Set a password");
      inquirer.prompt(questionsSet).then(async (answersSet) => {
        console.log(`New Password: ${answersSet.key} = ${answersSet.password}`);
      });
    }
  } else {
    console.log("Master Password is incorrect!");
  }
});
