const express = require("express")
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth")

//Welcome Page
router.get("/", (req, res)=>{
    res.render("Welcome")
})

//Dashboard page
router.get("/dashboard",ensureAuthenticated, (req, res)=>{
    res.render("dashboard")
})

//Logout 
router.get("/users/logout", (req, res)=>{
    req.logout()
    req.flash('success_msg', 'You are successfully loggedout !')
    res.redirect('/users/login')
})

module.exports = router ;