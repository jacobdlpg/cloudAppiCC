// Requires
const { Router } = require('express');
const moment = require('moment');
const User = require( '../models/user' );

// Variable initialization
const router = Router();
moment().format();


// Routes
// Render index page
router.get( '/', (req, res) => {
    res.render('home');
});

// Get users
router.get( '/getusers', (req, res) => {

    User.find( (err, users) => {

        if (err) {
            return res.status(500).json({
                description: 'Internal server error'
            });
        }

        res.json({
            description: 'OK',
            users
        });
    });
});

// Get user by id
router.get( '/getusersById/:userId', (req, res) => {

    let userId = req.params.userId;

    User.findById( userId, (err, user) => {

        if (err) {
            return res.status(400).json({
                description: 'Invalid user id'
            });
        }

        if (!user) {
            return res.status(404).json({
                description: 'User not found'
            });
        }

        res.json({
            description: 'OK',
            user
        });
    });
});

// Create user
router.post( '/createUsers', (req, res) => {

    let body = req.body;
    let formattedBirthDate = null;

    if (body.birthDate) {
        let date = new Date(body.birthDate);

        if ( moment(date).isValid() ) {
            formattedBirthDate = moment(body.birthDate).toDate();
        }
    }

    let user = new User({
        name: body.name,
        email: body.email,
        birthDate: formattedBirthDate,
        address: body.address
    });

    user.save( (err, savedUser) => {

        if (err) {
            return res.status(405).json({
                description: 'Invalid input'
            });
        }

        res.status(201).json({
            description: 'CREATED',
            user: savedUser
        });
    });
});

// Update user
router.put( '/updateUsersById/:userId', (req, res) => {

    let userId = req.params.userId;
    let body = req.body;
    let formattedBirthDate = null;

    if (body.birthDate) {
        let date = new Date(body.birthDate);

        if ( moment(date).isValid() ) {
            formattedBirthDate = moment(body.birthDate).toDate();
        }

        body.birthDate = formattedBirthDate;
    }
    
    User.findByIdAndUpdate( userId, body, { new: true, runValidators: true, context: 'query' }, (err, updatedUser) => {

        if (err) {

            if (err.name === 'ValidationError') {
                return res.status(405).json({
                    description: 'Invalid input'
                });

            } else {
                return res.status(400).json({
                    description: 'Invalid user id'
                });
            }
        }

        if (!updatedUser) {
            return res.status(404).json({
                description: 'User not found'
            });
        }

        res.json({
            description: 'OK',
            user: updatedUser
        });
    });
});

// Delete user
router.delete( '/deleteUsersById/:userId', (req, res) => {

    let userId = req.params.userId;

    User.findByIdAndRemove( userId, (err, deletedUser) => {

        if (err) {
            return res.status(400).json({
                description: 'Invalid user id'
            });
        }

        if (!deletedUser) {
            return res.status(404).json({
                description: 'User not found'
            });
        }

        res.json({
            description: 'OK'
        });
    });
});


module.exports = router;
