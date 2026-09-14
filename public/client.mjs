// Search when the button is clicked
document.getElementById('btnFindSpecialists').addEventListener('click', async () => {

    // Read the selected appointment time
    const selectedTime = document.getElementById('appointment_time').value;

    // Ask the server for available appointments
    const response = await fetch(`/findSpecialists/${selectedTime}`);

    // Read the appointments returned by the server
    const specialistSlots = await response.json();

    // Find and clear the results area
    const resultsArea = document.getElementById('specialistResults');

    resultsArea.innerHTML = '';

    // Display each appointment
    specialistSlots.forEach(slot => {

        // Create a div for the appointment
        const appointmentDiv = document.createElement('div');

        // Add the appointment information
        appointmentDiv.textContent =
            `Specialist: ${slot.specialist_name}, Specialty: ${slot.specialty}, Clinic: ${slot.clinic_name}, Time: ${slot.appointment_time}, Availability: ${slot.availability}`;

        // Create the Reserve button
        const reserveButton = document.createElement('button');
        reserveButton.textContent = 'Reserve';

        // Reserve this appointment when clicked
        reserveButton.addEventListener('click', async () => {
            const reserveResponse =
                await fetch(`/appointments/reserve/${slot.id}`, {
                    method: 'DELETE'
                });

            // Read and display the server message
            const reserveMessage = await reserveResponse.text();

            document.getElementById('appointmentStatus').textContent =
                reserveMessage;

        
        });

        // Add the button to the appointment
        appointmentDiv.appendChild(reserveButton);

        // Show the appointment on the page
        resultsArea.appendChild(appointmentDiv);
    });
});


// Create an account when the button is clicked
document.getElementById('btnCreateAccount').addEventListener('click', async () => {

    // Read the registration details
    const newUsername = document.getElementById('register_username').value;
    const newPassword = document.getElementById('register_password').value;
    const confirmedPassword = document.getElementById('register_confirm_password').value;

    // Send the details to the signup route
    const response = await fetch('/accounts/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newUsername, newPassword,confirmedPassword})
    });

    //Read the server message
    const signupMessage = await response.text();

    // Find the signup message area
    const signupStatus = document.getElementById('registrationStatus');

    // Display the result
    if (response.ok) {
        signupStatus.textContent = signupMessage;
    } else {
        signupStatus.textContent =
            `Registration failed: ${signupMessage}`;
    }
});


// Login when the button is clicked
document.getElementById('btnAccountLogin').addEventListener('click', async () => {

    // Read the login details
    const accountUsername = document.getElementById('account_username').value;

    const accountPassword = document.getElementById('account_password').value;

    // Send the details to the login route
    const response = await fetch('/accounts/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({accountUsername, accountPassword})
    });

    // Read the server message
    const loginMessage = await response.text();

    // Find the login message area
    const loginStatus = document.getElementById('accountStatus');

    // Display the result
    if (response.ok) {
        loginStatus.textContent = loginMessage;
    } else {
        loginStatus.textContent =
            `Login failed: ${loginMessage}`;
    }
});
//- Administrator: `healthadmin` / `admin123`
//- Patient: `patient1` / `patient123`
