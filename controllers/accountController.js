const path = require("path");
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model");
const { body } = require("express-validator")
const jwt = require("jsonwebtoken")
require("dotenv").config()



class LoginBuild {

    constructor() {
    }

    // Methods
     /* ***************************
    *  Build Login view.
    * ************************** */
    async buildLogin(req, res) {
        let nav = await utilities.getNav();
        return res.render("./account/login", {
        title: "Sign in",
        nav,
        errors:null,
        });
    }

     /* ***************************
    *  Build Registration view.
    * ************************** */

    async buildregistration(req, res) {
        let nav = await utilities.getNav();
        return res.render("./account/registration", {
        title: "Create Your Account",
        nav,
        errors: null,
        });
    }

     /* ***************************
    *  Build user account view.
    * ************************** */
     async builduseraccountview(req, res, next){
        let nav = await utilities.getNav()
        const account_id = parseInt(req.params.accId)
        const updateResult = await accountModel.infoUserAcount(account_id)
        const messages = await accountModel.getUnreadMessages(res.locals.account_id)
        const count = messages.length
        console.log("what account id is ?",account_id)
        res.render("./account/userportal", {
        title: 'Account management',
        nav,
        errors: null,
        account_id: updateResult.account_id,
        count: count,
        })
    }

    /* ****************************************
    *  Deliver messages view
    * *************************************** */
    async buildMessages(req, res, next) {
        let nav = await utilities.getNav()
        const message_from = parseInt(req.params.accId);
        const messages = await accountModel.getMessagesAndName(message_from)
        const archMessages = await accountModel.getArchivedMessages(message_from)
        const count = archMessages.length
        res.render("./account/messages", {
        title: ` Inbox`,
        nav,
        errors: null,
        message_from: message_from,
        count: count,
        messagesArray: messages
        })
    }

    /* ****************************************
    *  Deliver archived messages view
    * *************************************** */
    async buildArchivedMessages(req, res, next) {
        let nav = await utilities.getNav()
        const message_to = parseInt(req.params.accId);
        const archMessages = await accountModel.getArchivedMessages(message_to)
        console.log(archMessages)
        res.render("account/archived-messages", {
        title: `Archives`,
        nav,
        errors: null,
        messagesArray: archMessages
        })
    }
    /* ****************************************
    *  Deliver new message view
    * *************************************** */
    async buildNewMessage(req, res, next) {
        let nav = await utilities.getNav()
        const message_from = res.locals.account_id
        res.render("account/send-message", {
        title: 'New Message',
        nav,
        errors: null,
        message_from: message_from
        })
    }
    
    /* ****************************************
    *  Deliver reply message view
    * *************************************** */
    async buildReplyMessage(req, res, next) {
        let nav = await utilities.getNav()
        const message_from = res.locals.accountData.account_id
        const message_id = parseInt(req.params.messId);
        const message = await accountModel.getMessage(message_id)
        res.render("account/reply-message", {
        title: `RE: ${message.message_subject}`,
        nav,
        errors: null,
        message_from: message_from,
        message_to: message.message_from,
        message_subject: `RE: ${message.message_subject}`,
        message_body: `\n\n // Previous Message //\n${message.message_body}`,
        message_old_id: message_id
        })
    }
    /* ****************************************
    *  Deliver view message view
    * *************************************** */
    async buildViewMessage(req, res, next) {
        let nav = await utilities.getNav()
        const message_id = parseInt(req.params.messId);
        const message = await accountModel.getMessage(message_id)
        const sender = await accountModel.getAccountById(message.message_from)
        res.render("account/view-message", {
        title: message.message_subject,
        nav,
        errors: null,
        message: message,
        sender_name: `${sender.account_firstname} ${sender.account_lastname}`
        })
    }
    /* ****************************************
    *  Mark message as read
    * *************************************** */
    async messageRead(req, res, next) {
        const message_id = parseInt(req.params.messId);
        await accountModel.updateMessageRead(message_id);
        req.flash("notice", "You have successfully marked a message as read")
        res.redirect(`/account/messages/${res.locals.accountData.account_id}`)
    }
    /* ****************************************
    *  Archive message
    * *************************************** */
    async messageArchived(req, res, next) {
        const message_id = parseInt(req.params.messId);
        await accountModel.updateMessageArchive(message_id);
        req.flash("notice", "You have successfully archived a message")
        res.redirect(`/account/messages/${res.locals.accountData.account_id}`)
    }
    /* ****************************************
    *  Delete message
    * *************************************** */
    async messageDelete(req, res, next) {
        const message_id = parseInt(req.params.messId);
        await accountModel.deleteMessage(message_id);
        req.flash("notice", "You have successfully deleted a message")
        res.redirect(`/account/messages/${res.locals.accountData.account_id}`)
    }
    /* ****************************************
    *  Send new message
    * *************************************** */
    async getNewMessage(req, res) {
        let nav = await utilities.getNav()
        const { message_to, message_subject, message_body, message_from } = req.body
    
        const messageResult = await accountModel.newMessage(
        message_to,
        message_subject,
        message_body, 
        message_from
        )
        if (messageResult) {
        req.flash(
            "notice",
            `Congratulations, you\'ve sent a new message.`
        )
        res.redirect(`./account/messages/${message_from}`)
        } else {
        req.flash("notice", "Sorry, the  message failed.")
        res.status(501).render(`./account/messages`, {
            title: `Inbox`,
            nav,
            message_from: message_from
        })
        }
    }
    
    /* ****************************************
    *  Send reply message
    * *************************************** */
    async getReplyMessage(req, res) {
        let nav = await utilities.getNav()
        const { message_to, message_subject, message_body, message_from, message_old } = req.body
        const messageResult = await accountModel.newMessage(
        message_to,
        message_subject,
        message_body, 
        message_from
        )
        if (messageResult) {
        await accountModel.updateMessageArchive(message_old)
        req.flash(
            "notice",
            `Congratulations, you\'ve sent a new message.`
        )
        res.redirect(`/account/messages/${message_from}`)
        } else {
        req.flash("notice", "Sorry, the  message failed.")
        res.status(501).render(`./account/messages`, {
            title: `Inbox`,
            nav,
            message_from: message_from
        })
        }
    }

    /* ***************************
    *  Build Edit account view.
    * ************************** */

    async buildaccountupdateview(req, res) {
        let nav = await utilities.getNav();
        return res.render("./account/edituserinfo", {
        title: "Edit Your Account",
        nav,
        errors: null,
        });
    }

    /* ***************************
    *  check login view.
    * ************************** */

    async loginuserAccount(req, res) {
        let nav = await utilities.getNav();
        const { account_email, account_password } = req.body;
        const regResult = await accountModel.checkExistingEmail(account_email)
        if (!regResult) {
            req.flash("notice", "invalid username/password.")
            console.log("email??error");
            return res.status(401).render("./account/login", {
                title: "Sign in",
                nav,
                errors: null,
            })
        }
        try {
            if (await bcrypt.compare(account_password, regResult.account_password)) {
                delete regResult.account_password
                const accessToken = jwt.sign(regResult , process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
                res.locals.accountData = regResult
                res.locals.loggedin = 1
                return res.redirect("/account/");
            }
        } catch (error) {
            return new Error('Access Forbidden');
        }
        
    }
        


    /* ***************************
    *  check Registration view.
    * ************************** */

    async registeruserAccount(req, res) {
        let nav = await utilities.getNav();
        const { account_firstname, account_lastname, account_email, account_password } = req.body;
        let hashedPassword
        try {
            // regular password and cost (salt is generated automatically)
            hashedPassword = await bcrypt.hashSync(account_password, 10)
        } catch (error) {
            req.flash("notice", 'Sorry, there was an error processing the registration.')
            res.status(501).render("account/registration", {
            title: "Create Your Account",
            nav,
            errors: null,
            })
        }
        const regResult = await accountModel.registerAccount(account_firstname,account_lastname,account_email,hashedPassword)
        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you're registered ${account_firstname}. Please log in.`
            )
            res.locals.loggedin = 1
            return res.status(201).render("./account/login", {
                title: "Sign in",
                nav,
                errors: null,
            });
            
        } else {
            req.flash("notice", "Sorry, the registration failed.")
            return res.status(501).render("./account/registration", {
                title: "Create Your Account",
                nav,
                errors: null,
            })
        }
    }

      /* ***************************
    *  check JWT to give the user name.
    * ************************** */

    async requireAuth(req, res, next){
        const token = req.cookies.jwt;
      
        // check json web token exists & is verified
        if (token) {
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
              console.log(err.message);
              new Error('???? errror + error');
              res.locals.user = null;
            } else {
                const getAccountFirstname = (decodedToken) => {
                    const accountFirstname = decodedToken["account_firstname"];
                    return accountFirstname;
                }
                let user = getAccountFirstname(decodedToken);
                res.locals.user = user;

                const getAccountType = (decodedToken) => {
                    const accountType = decodedToken["account_type"];
                    return accountType;
                }
                let accounttype = getAccountType(decodedToken);
                if (accounttype === "Client"){
                    res.locals.type = accounttype
                } else if (accounttype === "Employee") {
                    res.locals.type = accounttype
                } else if (accounttype === "Admin") {
                    res.locals.type = accounttype
                }
                const getaccountid = (decodedToken) => {
                    const accountid = decodedToken["account_id"]
                    return accountid
                }
                let accountid = getaccountid(decodedToken)
                res.locals.accountid = accountid
                
              next();
            }
          });
        } else {
            res.locals.user = null;
            console.log("thisis the token",token);
            next()
        }
    };


      /* ***************************
    *  log out the user
    * ************************** */
    async logout(req, res) {
        res.locals.loggedin = 0
        res.locals.accountData ={}
        res.clearCookie('jwt');
        res.locals.user = null;
        res.redirect('/');
        
    }

         /* ***************************
        *  manage route auth user
        * ************************** */
    async clientnotAuth(req, res, next){
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
                if (err) {
                  console.log(err.message);
                  new Error('???? errror + error');
                } else {
                    const getAccountType = (decodedToken) => {
                        const accountType = decodedToken["account_type"];
                        return accountType;
                    }
                    let accounttype = getAccountType(decodedToken);
                    if (accounttype === "Client"){
                        req.flash("notice", "You are not authorized to view this page");
                        res.redirect('/account')
                    } else {
                        next();
                    }
                }

            })
        }
    }


    

    /* ***************************
    *  Return Inventory by Classification As JSON
    * ************************** */
    async getAcountJSON (req, res, next) {
        const account_id = parseInt(req.params.accId)
        const accountData = await accountModel.infoUserAcount(account_id)
        const accountData1 = accountData[0].account_id
        console.log("json ?",accountData)
        console.log("json1111 ?",accountData1)
        if (accountData1) {
        return res.json(accountData)
        } else {
        next(new Error("No data returned"))
        }
    }
     /* ***************************
    *  Build edit Account view.
    * ************************** */
     async editAccountview(req, res) {
        const account_id = parseInt(req.params.accId)
        const userdata = await accountModel.infoUserAcount(account_id)
        let nav = await utilities.getNav();
        return res.render("./account/edituserinfo", {
        title: "Edit Your Account",
        nav,
        errors: null,
        account_firstname: userdata.account_firstname,
        account_lastname: userdata.account_lastname,
        account_email: userdata.account_email,
        account_id: account_id,
        });
    }



     /* ***************************
    *  check edit Account view.
    * ************************** */

    async editAccount(req, res){
        let nav = await utilities.getNav();
        const {edit_firstname, edit_lastname, edit_email, account_id} = req.body;

        const updateResult = await accountModel.editAccount(edit_firstname, edit_lastname, edit_email, account_id)
        console.log("updateresultwyoyoot",updateResult)
        

        
        if (updateResult) {
            let account_type = res.locals.accountData.account_type
            let accountData = {edit_firstname, edit_lastname, edit_email, account_id: parseInt(account_id)}
            res.clearCookie("jwt")
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            req.flash("notice", "Your account was successfully updated.")
            res.redirect("/account/")
        } else {
          const userdata = await accountModel.infoUserAcount(updateResult)
          req.flash("notice", "Sorry, the update failed.")
          res.status(501).render("./account/edituserinfo", {
            title: "Edit Your Account",
            nav,
            errors: null,
            edit_firstname: userdata.account_firstname,
            edit_lastname: userdata.account_lastname,
            edit_email: userdata.account_email,
            account_id: account_id,
            });
        }
    }
 

}

module.exports = LoginBuild