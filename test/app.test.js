// Requires
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../models/user');

// Variable initialization
const { expect } = chai;
chai.use( chaiHttp );


// Tests
describe( 'Users CRUD', () => {

    // Global test variables initialization
    // User model
    const validUser = new User({
        name: 'Test',
        email: 'test@test.com',
        birthDate: '1990-01-31T00:00:00.000Z',
        address: {
            street: '12th Street',
            state: 'CA',
            city: 'Los Angeles',
            country: 'USA',
            zip: '90001'    
        }
    });

    // Variable to store created user id
    let userId = null;

    // Fake id variables to provoke errors
    const nonExistingUserId = mongoose.Types.ObjectId();
    const malformedUserId = nonExistingUserId.toHexString().slice(0, -1);


    // Get users
    describe( 'GET users', () => {

        it( 'Should get users array', done => {
            chai
                .request(app)
                    .get('/getusers')
                    .end( (err, res) => {

                        okStatus( err, res, done, 'array' );
                    });
        });
    });


    // Create user
    describe( 'POST user', () => {

        it( 'Should create user', done => {

            chai
                .request(app)
                    .post('/createUsers')
                    .send( validUser )
                    .end( (err, res) => {

                        if (err) return done(err);

                        expect(res).to.have.status(201);
                        expect(res.body.description).to.equals('CREATED');
                        expect(res.body.user).to.be.an('object');

                        userId = res.body.user._id;

                        done();
                    });
        });

        it( 'Should have 405 error (email already exists)', done => {

            chai
                .request(app)
                    .post('/createUsers')
                    .send( validUser )
                    .end( (err, res) => {
                        
                        invalidInput( err, res, done );
                    });
        });

        it( 'Should have 405 error (malformed email)', done => {

            let invalidUser = validUser;
            // Trigger email validation error
            invalidUser.email = 'abc@.';

            chai
                .request(app)
                    .post('/createUsers')
                    .send( invalidUser )
                    .end( (err, res) => {
                        
                        invalidInput( err, res, done );
                    });
        });

        it( 'Should have 405 error (invalid date)', done => {

            let invalidUser = validUser;
            // Prevent email validation error
            invalidUser.email = 'another@email.com';
            // Trigger invalid date validation error
            invalidUser.birthDate = 'dd-MM-yyyy';

            chai
                .request(app)
                    .post('/createUsers')
                    .send( invalidUser )
                    .end( (err, res) => {
                        
                        invalidInput( err, res, done );
                    });
        });

        it( 'Should have 405 error (missing required properties)', done => {

            let invalidUser = {
                name: 'Test',
                email: 'another@email.com'
            };

            chai
                .request(app)
                    .post('/createUsers')
                    .send( invalidUser )
                    .end( (err, res) => {
                        
                        invalidInput( err, res, done );
                    });
        });
    });


    // Get user by id
    describe( 'GET user by id', () => {

        it( 'Should get user', done => {

            chai
                .request(app)
                    .get(`/getusersById/${userId}`)
                    .end( (err, res) => {

                        okStatus( err, res, done, 'object');
                    });
        });

        it( 'Should have 400 error (Invalid user id)', done => {
            
            chai
                .request(app)
                    .get(`/getusersById/${malformedUserId}`)
                    .end( (err, res) => {

                        invalidUserId( err, res, done );
                    });

        });

        it( 'Should have 404 error (User not found)', done => {

            chai
                .request(app)
                    .get(`/getusersById/${nonExistingUserId}`)
                    .end( (err, res) => {
                        
                        userNotFound( err, res, done );
                    });
        });
    });


    // Update user
    describe( 'PUT user', () => {

        it( 'Should update user', done => {

            chai
                .request(app)
                    .put(`/updateUsersById/${userId}`)
                    .send( { name: 'User' } )
                    .end( (err, res) => {

                        okStatus( err, res, done, 'object');
                    });
        });

        it( 'Should have 405 error (malformed email)', done => {

            chai
                .request(app)
                    .put(`/updateUsersById/${userId}`)
                    .send( { email: 'abc@.' } )
                    .end( (err, res) => {
                        
                        invalidInput( err, res, done );
                    });
        });

        it( 'Should have 405 error (invalid date)', done => {

            chai
                .request(app)
                    .put(`/updateUsersById/${userId}`)
                    .send( { birthDate: 'dd-MM-yyyy' } )
                    .end( (err, res) => {
                        
                        invalidInput( err, res, done );
                    });
        });

        it( 'Should have 405 error (missing required properties)', done => {

            chai
                .request(app)
                    .put(`/updateUsersById/${userId}`)
                    .send( { address: { state: 'SF' } } )
                    .end( (err, res) => {
                        
                        invalidInput( err, res, done );
                    });
        });

        it( 'Should have 400 error (Invalid user id)', done => {
            
            chai
                .request(app)
                    .put(`/updateUsersById/${malformedUserId}`)
                    .end( (err, res) => {
                        
                        invalidUserId( err, res, done );
                    });
        });

        it( 'Should have 404 error (User not found)', done => {

            chai
                .request(app)
                    .put(`/updateUsersById/${nonExistingUserId}`)
                    .end( (err, res) => {
                        
                        userNotFound( err, res, done );
                    });
        });
    });


    // Delete user
    describe( 'DELETE user', () => {

        it( 'Should delete user', done => {

            chai
                .request(app)
                    .delete(`/deleteUsersById/${userId}`)
                    .end( (err, res) => {

                        okStatus( err, res, done );
                    });
        });

        it( 'Should have 400 error (Invalid user id)', done => {
    
            chai
                .request(app)
                    .delete(`/deleteUsersById/${malformedUserId}`)
                    .end( (err, res) => {
        
                        invalidUserId( err, res, done );
                    });
        });

        it( 'Should have 404 error (User not found)', done => {

            chai
                .request(app)
                    .delete(`/deleteUsersById/${nonExistingUserId}`)
                    .end( (err, res) => {
            
                        userNotFound( err, res, done );
                    });
        });
    });
});


// Functions for different status

okStatus = ( err, res, done, type ) => {
                        
    if (err) return done(err);

    expect(res).to.have.status(200);
    expect(res.body.description).to.equals('OK');

    if (type === 'array') expect(res.body.users).to.be.a(type);
    if (type === 'object') expect(res.body.user).to.be.a(type);

    done();
};

invalidInput = ( err, res, done ) => {

    if (err) return done(err);

    expect(res).to.have.status(405);
    expect(res.body.description).to.equals('Invalid input');

    done();
}

invalidUserId = ( err, res, done ) => {

    if (err) return done(err);

    expect(res).to.have.status(400);
    expect(res.body.description).to.equals('Invalid user id');

    done();
};

userNotFound = ( err, res, done ) => {

    if (err) return done(err);

    expect(res).to.have.status(404);
    expect(res.body.description).to.equals('User not found');

    done();
};