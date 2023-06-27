// Needed Resources 
const LoginBuild = require("../controllers/accountController");
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")
const logregbuild = new LoginBuild()



     /* ***************************
    *   views
    * ************************** */

//route to account user profile
router.get("/", utilities.checkLogin, utilities.handleErrors(logregbuild.builduseraccountview))

// route to login view
router.get("/login/", utilities.handleErrors(logregbuild.buildLogin));

// route to regtration view
router.get("/registration/", utilities.handleErrors(logregbuild.buildregistration));

// route to edit account user profile view
//router.get("/editaccount/", utilities.handleErrors(logregbuild.buildaccountupdateview))

     /* ***************************
    *  json data to get info from account user profile
    * ************************** */

// route to get the json data
router.get("/getAccount/:account_id", utilities.handleErrors(logregbuild.getAcountJSON))  

//route to edit account user profile
router.get("/edit/:account_id", utilities.handleErrors(logregbuild.editAccountview))


     /* ***************************
    *  Add and Update acounts user profiles to the database
    * ************************** */
// route to post a new login on the database
router.post("/login/", regValidate.loginRules(), regValidate.checkRegDatalogin, utilities.handleErrors(logregbuild.loginuserAccount))

// route to post a new user profile on the database
router.post("/registration/", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(logregbuild.registeruserAccount));

// route to post a edit account on the database
router.post("/update/", regValidate.editaccountRules(), regValidate.checkeditaccountData, utilities.handleErrors(logregbuild.editAccount))

// router to post a edit account password on the database
//router.post("/update/", utilities.handleErrors(logregbuild.editpasswordAccount))

module.exports = router
