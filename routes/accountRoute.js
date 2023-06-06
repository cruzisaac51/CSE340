// Needed Resources 
const LoginBuild = require("../controllers/accountController");
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")
const logregbuild = new LoginBuild()


// login route
router.get("/login/", utilities.handleErrors(logregbuild.buildLogin));


// registration route
router.get("/registration/", utilities.handleErrors(logregbuild.buildregistration));

// server validation login route
router.post("/login/", regValidate.loginRules(), regValidate.checkRegDatalogin, utilities.handleErrors(logregbuild.loginuserAccount))

// server validation post route
router.post("/registration/", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(logregbuild.registeruserAccount));



module.exports = router
