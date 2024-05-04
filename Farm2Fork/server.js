const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/farm2fork', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String
});

// Route for signup
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Create a new user document
    const newUser = new User({
        name,
        email,
        password
    });

    // Save the new user to the database
    newUser.save()
        .then(user => {
            console.log('User created successfully:', user);
            res.status(200).send('User created successfully');
        })
        .catch(error => {
            console.error('Error creating user:', error);
            res.status(500).send('Error creating user');
        });
});

// Route for login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user with the given email
    User.findOne({ email })
        .then(user => {
            if (!user) {
                // User not found
                res.status(404).send('User not found');
                return;
            }

            // Check if the password matches
            if (user.password !== password) {
                // Incorrect password
                res.status(401).send('Incorrect password');
                return;
            }

            // Login successful
            res.status(200).send('Login successful');
        })
        .catch(error => {
            console.error('Error during login:', error);
            res.status(500).send('Error during login');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});