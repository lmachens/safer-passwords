// import readline from 'readline';
const readline = require("readline");

const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

interface.question("What's your password?", password => {
    console.log(`Your password is ${password}`);
    if (password !== 'abc') {
        console.log('Wrong password');
        interface.close();
        return;
    }

    interface.question("What's your name?", name => {
        console.log(`Your name is ${name}`);
        interface.close();
    })
})