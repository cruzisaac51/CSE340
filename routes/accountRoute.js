// Needed Resources 
const express = require("express")
const router = new express.Router() 
const buildLogin = require("../controllers/accountController")
const utilities = require("../utilities/")

// login route
router.get("/login/", utilities.handleErrors(buildLogin.buildLogin));


// registration route
router.get("/registration/", utilities.handleErrors(buildLogin.buildregistration));

module.exports = router