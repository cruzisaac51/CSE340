// Needed Resources 
const LoginBuild = require("../controllers/accountController");
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const logregbuild = new LoginBuild()

// login route
router.get("/login/", utilities.handleErrors(logregbuild.buildLogin));


// registration route
router.get("/registration/", utilities.handleErrors(logregbuild.buildregistration));

// registration post route
router.post("/registration/", utilities.handleErrors(logregbuild.registeruserAccount));

module.exports = router