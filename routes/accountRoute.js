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

//Route to messages center
router.get("/messages/:accId",  utilities.checkLogin, utilities.checkJWTToken, utilities.handleErrors(logregbuild.buildMessages));
//Route to view achived messages
router.get('/view-achived/:accId', utilities.checkLogin, utilities.handleErrors(logregbuild.buildArchivedMessages))
//Route to new message
router.get("/send-message/", utilities.checkLogin, utilities.handleErrors(logregbuild.buildNewMessage))
//Route to reply to a message
router.get('/reply-message/:messId', utilities.checkLogin, utilities.handleErrors(logregbuild.buildReplyMessage))
//Route to veiw a message
router.get('/view-message/:messId', utilities.checkLogin, utilities.handleErrors(logregbuild.buildViewMessage))
//Route to change message to read
router.get('/mark-read/:messId', utilities.checkLogin, utilities.handleErrors(logregbuild.messageRead))
//Route to archive message
router.get('/archive-message/:messId', utilities.checkLogin, utilities.handleErrors(logregbuild.messageArchived))
//Route to delete message
router.get('/delete-message/:messId', utilities.checkLogin, utilities.handleErrors(logregbuild.messageDelete))

// route to edit account user profile view
//router.get("/editaccount/", utilities.handleErrors(logregbuild.buildaccountupdateview))

     /* ***************************
    *  json data to get info from account user profile
    * ************************** */

// route to get the json data
router.get("/getAccount/:accId", logregbuild.clientnotAuth, utilities.checkLogin, utilities.checkJWTToken, utilities.handleErrors(logregbuild.getAcountJSON))  

//route to edit account user profile
router.get("/edit/:accId", utilities.checkLogin,utilities.checkJWTToken, utilities.handleErrors(logregbuild.editAccountview))


     /* ***************************
    *  Add and Update acounts user profiles to the database
    * ************************** */
// route to post a new login on the database
router.post("/login/", regValidate.loginRules(), regValidate.checkRegDatalogin, utilities.handleErrors(logregbuild.loginuserAccount))

// route to post a new user profile on the database
router.post("/registration/", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(logregbuild.registeruserAccount));

// route to post a edit account on the database
router.post("/update/", utilities.checkLogin, regValidate.editaccountRules(), regValidate.checkeditaccountData, utilities.handleErrors(logregbuild.editAccount))
//Route to send update info
router.post("/updatePassword/", utilities.checkLogin, regValidate.updateAccountPasswordRules(), regValidate.checkUpdatePasswordData, utilities.handleErrors(logregbuild.accountPasswordUpdate))


//Route to send a new message
router.post('/send_message/', utilities.checkLogin, regValidate.newMessageRules(), regValidate.checkNewMessageData, utilities.handleErrors(logregbuild.getNewMessage))
//Route to send a new reply
router.post('/send_reply/', utilities.checkLogin, regValidate.newMessageRules(), regValidate.checkReplyMessageData, utilities.handleErrors(logregbuild.getReplyMessage) )

module.exports = router
