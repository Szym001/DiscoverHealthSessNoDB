// Import Express so we can create the web server and its routes.
import express from 'express';

// Import the session system.
// A session allows the server to remember that a user has logged in.
import session from 'express-session';

// Import the SQLite database package.
import Database from 'better-sqlite3';


// Create the Express application.
const app = express();

// Open the DiscoverHealth database.
const db = new Database('discoverhealth.db');


// Allow Express to send files from the public folder to the browser.
// This includes index.html, client.mjs and styles.css.
app.use(express.static('public'));

// Allow the server to read JSON sent inside a request body.
app.use(express.json());

// Set up the login session system.
app.use(session({

    // Secret text used to protect the session.
    secret: 'discoverhealth-practice-secret',

    // Do not save the session again when nothing has changed.
    resave: false,

    // Do not create a session until it is actually needed.
    saveUninitialized: false
}));


//GET route searches for available specialist appointments.
app.get('/findSpecialists/:appointmentTime', (req, res) => {

    // Prepare an SQL query.
    const stmt = db.prepare(
        'SELECT * FROM specialist_slots WHERE appointment_time = ? AND availability > 0'
    );

    // returns all matching database rows as an array and stores it in specialistSlots.
    const specialistSlots = stmt.all(req.params.appointmentTime);

    // Send the array of matching appointments to the client as JSON.
    res.json(specialistSlots);
});


// This DELETE route reserves one appointment.
app.delete('/appointments/reserve/:slotId', (req, res) => {

    // Prepare an SQL UPDATE query.
    const stmt = db.prepare(
        'UPDATE specialist_slots SET availability = availability - 1 WHERE id = ? AND availability > 0'
    );

    const result = stmt.run(req.params.slotId);

    // result.changes tells us how many database rows were updated.

    // If it is zero, the appointment was not available or did not exist.
    if (result.changes === 0) {

        // Send status 409 and stop this route.
        return res.status(409).send('This appointment is no longer available.');
    }

    // If a row was updated, tell the client the reservation succeeded.
    res.status(200).send('Appointment reserved successfully.');

});


// This POST route creates a new user account.
app.post('/accounts/signup', (req, res) => {

    // Read the three values sent in the JSON request body.
    const {newUsername, newPassword, confirmedPassword} = req.body;

    // Check whether any input is empty.
    if (
        newUsername === '' ||
        newPassword === '' ||
        confirmedPassword === ''
    ) {

        // Status 400 means the client sent invalid information.
        return res.status(400).send('All signup fields are required.');
    }

    // Check whether the two entered passwords are different.
    if (newPassword !== confirmedPassword) {

        // Send an error and stop before inserting the user.
        return res.status(400).send('The passwords do not match.');
    }

    // Prepare an SQL query that inserts a new database row.
   const statement = db.prepare(
    'INSERT INTO directory_users (username, password) VALUES (?, ?)'
);

   statement.run(newUsername, newPassword);

   res.status(200).send('Account created successfully.');

   });


// This POST route checks a user's login information.
app.post('/accounts/login', (req, res) => {

    // Read the username and password from the JSON request body.
    const {accountUsername, accountPassword} = req.body;

    // Prepare an SQL query that searches for one matching user.
    const stmt = db.prepare(
        'SELECT * FROM directory_users WHERE username = ? AND password = ?'
    );

    // .get() returns one matching database row.
    // If no row matches, it returns undefined.
    const matchedUser = stmt.get(accountUsername, accountPassword);

    // If no matching user was found, reject the login.
    if (!matchedUser) {

        // Status 401 means the user has not been authenticated.
        return res.status(401).send('Incorrect username or password.');
    }

    // Remember the logged-in user's username in their session.
    req.session.username = matchedUser.username;

    // Also remember whether the user is an administrator.
    req.session.adminStatus = matchedUser.admin_status;

    // Send a successful login message to the client.
    res.status(200).send(`Welcome, ${matchedUser.username}.`);
});


// Set the port number used by the server.
const PORT = 3000;


// Start the server and listen for requests on port 3000.
app.listen(PORT, () => {

    // Display this message in the VS Code terminal when the server starts.
    console.log(
        `DiscoverHealth is running at http://localhost:${PORT}`
    );
});