const express = require('express');
const app = express();
const config = require('./config');
const Category = require('./models/category');
const Contact = require('./models/contact');
const Image = require('./models/image');
const User = require('./models/user');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static('public/images')); // This line makes the uploads folder publicly accessible.
app.use(express.urlencoded({ extended: false })); //This global middleware is for the app.post('contact-us')

//This section of code below is dedicated to the authentification of a user's information (email & password).
config.authenticate().then(() => {
    console.log('Database connected!');
}).catch((err) => {
    console.log(err);
});

// This next section of code configures the upload/public folder and upload filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


// Here are all of the 'GET' API calls for the 4 models (category, contact, image and user).
// Recall that routes are also called 'endpoints'.
app.get('/categories', function (req, res) {
    Category.findAll().then(function (result) {
        res.status(200).send(result);
    }).catch(function (err) {
        res.status(500).send(err);
        // You could use 418 to say "I'm a teapot... "
    });
});

// To 'GET' all of the contact information, including messages
app.get('/contacts', function (req, res) {
    Contact.findAll().then(function (result) {
        res.status(200).send(result);
    }).catch(function (err) {
        res.status(500).send(err);
    });
});

app.get('/images', function (req, res) {
    let category_id = req.query.id;
    let data = {};
    if (category_id) {
        data.where = { category_id }
    }
    Image.findAll(data).then(function (result) {
        res.status(200).send(result);
    }).catch(function (err) {
        res.status(500).send(err);
    });
});

// Will eventually use this piece of code to retreive all users/clients that sign-in.
// app.get('/users', function (req, res) {
//     User.findAll().then(function (result) {
//         res.status(200).send(result);
//     }).catch(function (err) {
//         res.status(500).send(err);
//     });
// });


// Here are all of the 'POST' API calls for the 4 models (category and image).
app.post('/category', function (req, res) {
    let category = req.body;
    Category.create(category).then(function (result) {
        res.redirect('/');
    }).catch(function (err) {
        res.send(err);
    });
});

// API call to post (singular) image(s)
app.post('/images', multer({ storage }).single('image'), function (req, res) {

    let image = req.body;

    let image_data = {
        category_id: req.body.category_id,
        title: req.body.title,
        filename: req.file ? req.file.filename : null,
        created_at: new Date()
    };

    Image.create(image_data).then(function (result) {
        res.send(result);
    }).catch(function (err) {
        res.send(err);
    });
});

// RECAL: that 'POST' is where we create new data. We don't need an app.post for 'User' because the photographer will not be creating the user themselves (for now), the contact table will become populated when a new client inputs their data.

// Unsure if this below section of code is redundent to the section below (app.post('register'). 
// app.post('/', function (req, res) {
// Here we are going to create a new user
// let newUser = req.body;
// User.push(newUser);
//     res.redirect('/'); //Redirect to the Get route above
// });

// Recall: that 'req' is for sending data from the frontend (browser) to the backend/database. And 'res' is for sending data from the backend/database to the frontend (browser). So, the below chunk of code (app.post) can be used to send a new contact's information from the frontend contact us form to the 'contacts' table in the database.
app.post('/contacts', function (req, res) {
    // In order for the 'body' part to work we need a global middleware.
    let newContact = req.body;
    newContact.created_at = new Date();
    Contact.create(newContact).then(function (result) {
        res.send(result);
    }).catch(function (err) {
        res.send(err);
    });
});

app.post('/register', function (req, res) {
    let plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
        // This hash should give a unique hash value. But, the saltrounds will make this even moreso, saltrounds increases the efficiency of making sure that every hash value is unique.

        // May have to change 'user_data' to something else. But, below is the object that we have created to store in the database... So, may have to make a table for 'user' in the database... 
        let user_data = {
            name: req.body.name,
            email: req.body.email,
            password: hash
        };

        // This next few lines of code will simply add a new record to the database... Probably need a 'user' database. Still need to create a table for 'User' in the database.
        User.create(user_data).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(err);
        });
    });
});

app.post('/login', function (rew, res) {

    let email = req.body.email;
    let password = req.body.password;
    let user_data = {
        where: { email } // {email : email} -> This is an object that was created and this statement basically says "where the email column = the email value. Or, shorthand just say "email".
    }

    // The below section of code finds a user based on their email. In Sequelize, you can use a where statement to find something specific, like an email or name. This will check if the email that is stored in the database is equal to the email that was submitted by the user.
    User.findOne(user_data).then((result) => {

        if (result) {
            console.log(result);
            // In the below line of code, the 'password' portion is the plain-text password, and the 'result.password' is the hashed password. And this function compares them, the output will then either be true or false.
            bcrypt.compare(password, result.password, function (err, output) {
                console.log(output);
                if (output) {
                    res.status(200).send(result);
                } else {
                    res.status(400).send('Incorrect password.');
                }
            });
        }
        else {
            res.status(404).send('User does not exist.');
        }
    }).catch((err) => {
        res.status(500).send(err);
    });
});

// Have not created a delete for Contact and User, because these are actions that are less likely to be done in the future.
app.delete('/:id', function (req, res) {
    let id = req.params.id;
    Category.findByPk(id).then((result) => {
        result.destroy().then((result) => {
            res.send(result)
        }).catch((err) => {
            res.send(err);
        });
    }).catch((err) => {
        res.send(err);
    });
});

// For the 'Delete' of images, should I change the 'id' section to 'filename', because the photographer is far more likely to be able to identify an image based on an image's filename, as opposed to an image's id. Ask Emmanuel.
app.delete('/:id', function (req, res) {
    let id = req.params.id;
    Image.findByPk(id).then((result) => {
        result.destroy().then((result) => {
            res.send(result)
        }).catch((err) => {
            res.send(err);
        });
    }).catch((err) => {
        res.send(err);
    });
});


app.listen(process.env.PORT || 5000, () => {
    console.log('Service is running on port 5000.')
});