const inquirer = require("inquirer");

const questions = [
  {
    type: "password",
    name: "password",
    message: "What's your master password?",
  },
  {
    type: "input",
    name: "key",
    message: "Which password do you need?",
  },
];

inquirer.prompt(questions).then((answers) => {
  console.log(`Your password is ${answers.password}!`);
  console.log(`You like to know the password of ${answers.key}!`);

  if (answers.password === "123") {
    console.log("Password is correct!");
  } else {
    console.log("Password is incorrect!");
  }
});
