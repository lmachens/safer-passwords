const {
  askStartQuestions,
  askGetPasswordQuestions,
  askSetPasswordQuestions,
  CHOICE_GET,
  CHOICE_SET,
} = require("./lib/questions");
const { readPassword } = require("./lib/passwords");

async function main() {
  const { masterPassword, action } = await askStartQuestions();

  if (masterPassword === "123") {
    console.log("Master Password is correct!");
    if (action === CHOICE_GET) {
      console.log("Now Get a password");
      const { key } = await askGetPasswordQuestions();
      try {
        const password = await readPassword(key);
        console.log(`Your ${key} password is ${password}`);
      } catch (error) {
        console.error("Something went wrong 😑");
        // What to do now?
      }
    } else if (action === CHOICE_SET) {
      console.log("Now Set a password");
      const { key, password } = await askSetPasswordQuestions();
      console.log(`New Password: ${key} = ${password}`);
    }
  } else {
    console.log("Master Password is incorrect!");
  }
}

main();
