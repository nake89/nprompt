import { createInterface } from 'readline/promises';
const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});
process.stdin.setRawMode(true); // Enable raw mode to capture each keypress
let userInput = ''; // Variable to store user input
process.stdin.on('data', (key) => {
    userInput += key.toString();
    process.stdout.write("\n");
    process.stdout.write(key); // Echo the key back to the console
});
const answer = await rl.question('Is this example useful? [y/n] ');
process.stdin.setRawMode(false); // Enable raw mode to capture each keypress
switch (answer.toLowerCase()) {
    case 'y':
        console.log('Super!');
        break;
    case 'n':
        console.log('Sorry! :(');
        break;
    default:
        console.log('Invalid answer!');
}
console.log(userInput);
rl.close();
