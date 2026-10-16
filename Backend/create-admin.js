// Creates an admin account (signing up in the app can only create customers and agents).
// Usage, from Backend/: npm run create-admin
require('dotenv').config({ quiet: true });
const readline = require('readline');
const bcrypt = require('bcryptjs');
const database = require('./database');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Lines are queued as they arrive, so answers piped in all at once are not lost
const pendingLines = [];
let waitingForLine = null;
let inputClosed = false;
rl.on('line', (line) => {
    if (waitingForLine) {
        const resolve = waitingForLine;
        waitingForLine = null;
        resolve(line);
    }
    else {
        pendingLines.push(line);
    }
});
rl.on('close', () => {
    inputClosed = true;
    waitingForLine && waitingForLine(null);
});

// While muted, what the user types is not echoed (used for passwords)
let muted = false;
rl._writeToOutput = (text) => {
    if (!muted) {
        rl.output.write(text);
    }
}

const ask = async (question, hidden = false) => {
    rl.setPrompt(question);
    process.stdout.write(question);
    muted = hidden;

    let answer;
    if (pendingLines.length !== 0) {
        answer = pendingLines.shift();
    }
    else if (inputClosed) {
        answer = null;
    }
    else {
        answer = await new Promise((resolve) => { waitingForLine = resolve; });
    }

    if (hidden) {
        muted = false;
        process.stdout.write('\n');
    }
    if (answer === null) {
        throw new Error('Input ended before all questions were answered');
    }
    return answer;
}

const main = async () => {
    const username = (await ask('Username: ')).trim();
    if (!username) {
        throw new Error("Username can't be empty");
    }
    const taken = await database.query(`SELECT CHECK_USERNAME($1)`, [username]);
    if (taken[0].check_username === 1) {
        throw new Error(`Username '${username}' is already taken`);
    }

    const email = (await ask('Email: ')).trim();
    if (!/^.+@.+\..+$/.test(email)) {
        throw new Error("That doesn't look like an email address");
    }
    const firstName = (await ask('First name: ')).trim();
    const lastName = (await ask('Last name: ')).trim();

    const password = await ask('Password (at least 8 characters): ', true);
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
    }
    if (password !== await ask('Confirm password: ', true)) {
        throw new Error("Passwords don't match");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL, PHOTO)
                   VALUES ($1, $2, $3, $4, 'admin', $5, '')`;
    await database.query(query, [username, hashedPassword, firstName, lastName, email]);

    console.log(`Admin '${username}' created. Log in with it in the app.`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(`Could not create the admin: ${error.message}`);
        process.exit(1);
    });
