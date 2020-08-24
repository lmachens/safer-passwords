const inquirer = require("inquirer");

const questions = [
  {
    type: "password",
    name: "password",
    message: "What's your password?",
  },
  {
    type: "input",
    name: "name",
    message: "What's your name?",
  },
];

inquirer.prompt(questions).then((answers) => {
  console.log(`Your password is ${answers.password}!`);
  console.log(`Your name is ${answers.name}!`);
});
