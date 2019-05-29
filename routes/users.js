const express = require("express")
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

//user Model
const User = require('../models/User')

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // check required field 
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill all the required options...' })
    }

    //check password match 
    if (password !== password2) {
        errors.push({ msg: 'Password do not match ' })
    }

    //check pass length 
    if (password.length < 6) {
        errors.push({ msg: 'Password should be atleast 6 charecter ' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else {
        //Validation model 
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //user exist
                    errors.push({ msg: 'Email is already registred' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });

                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password,

                    })

                    //hash password 
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            //set the password 
                            newUser.password = hash;

                            //save user 
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg','You are now registred')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }
            });
    }
})

//Login handle 
router.post('/login', (req, res, next)=> {
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req, res, next)
})

module.exports = router;