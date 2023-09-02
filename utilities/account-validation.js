const utilities = require(".")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
var validator = require('validator');
const { body, validationResult, check, oneOf} = require("express-validator")


const validate = {}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
    validate.loginRules = () => {
        return [
            body("account_email")
            .isEmail()
            .withMessage("invalid username/passworde.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists){
                    console.log("mybei45s34er", emailExists)
                    throw new Error("invalid username/passworde")
                }
            }),
            body("account_password")
            .exists()
            .withMessage("invalid username/passwordp.")
            .custom(async (account_password,{req}) => {
                const passwordExists = await accountModel.checkExistingPassword(account_password)
                passwordExists.rows.forEach(async row => {
                    let hashedPassword = await bcrypt.compare(row.account_password, bcrypt.hash)
                    if (!hashedPassword) {
                        console.log("mybeis34er", passwordExists)
                        throw new Error("Access Forbiddddden")
                    }
                });
            }),
        ]
    }

    /* ******************************
    * Check data and return errors or continue to login process
    * ***************************** */
    validate.checkRegDatalogin = async (req, res, next) => {
        const {account_email} = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log("mybeisher", errors)
            let nav = await utilities.getNav()
            res.render("account/login", {
                errors,
                title: "Sign in",
                nav,
                account_email,
            })
        return
        }
        next()
    }


/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
    validate.registationRules = () => {
        return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a first name."), // on error this message is sent.
    
        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.
        // valid email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
                throw new Error("Email exists. Please log in or use different email")
            }
        }),

    
        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
        ]
        
    }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
    validate.checkRegData = async (req, res, next) => {
        const { account_firstname, account_lastname, account_email } = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/registration", {
            errors,
            title: "Create Your Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
        }
        next()
    }
  



    /*  **********************************
 *  Edit account Validation Rules
 * ********************************* */
    validate.editaccountRules = () => {
        return [
            // firstname is required and must be string
            body("edit_firstname")
                .trim()
                .isLength({ min: 2 })
                .withMessage("Please provide a first name."), // on error this message is sent.
        
            // lastname is required and must be string
            body("edit_lastname")
                .trim()
                .isLength({ min: 2 })
                .withMessage("Please provide a last name."), // on error this message is sent.
        
            // valid email is required and cannot already exist in the DB
            // valid email is required and cannot already exist in the database
            body("edit_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required."),

            body("edit_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
        ]
    }

    /* ******************************
        * Check data and return errors or continue editing account
        * ***************************** */
    validate.checkeditaccountData = async (req, res, next) => {
        const { edit_firstname, edit_lastname, edit_email,} = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            res.render("account/edituserinfo", {
                errors,
                title: "Edit Your Account",
                nav,
                edit_firstname,
                edit_lastname,
                edit_email,
            })
            return
        }
        next()
    }




    /*  **********************************
    *  Update account password Validation Rules
    * ********************************* */
    validate.updateAccountPasswordRules = () => {
        return [
        // password is required and must be strong password
        body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
        ]
    }
    /* ******************************
    * Check updated password data
    * ***************************** */
    validate.checkUpdatePasswordData = async (req, res, next) => {
        const { account_firstname, account_lastname, account_email, account_id } = res.locals.accountData
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update-view", {
            errors,
            title: "Update Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
        return
        }
        next()
    }

    /*  **********************************
    *  New Message Validation Rules
    * ********************************* */
    validate.newMessageRules = () => {
        return [
        // Recipient is required and must be a number
        body("message_to")
            .trim()
            .isNumeric()
            .withMessage("Please select a recipient."), // on error this message is sent.
    
        // Subject is required and must be string
        body("message_subject")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a subject."), // on error this message is sent.
    
        // Body is required and must be string
        body("message_body")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a body."), // on error this message is sent.
        ]
    }

     /* ******************************
    * Check data and return errors or continue to sending new message
    * ***************************** */
    validate.checkNewMessageData = async (req, res, next) => {
        const { message_to, message_subject, message_body } = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/send-message", {
            errors,
            title: "New Message",
            nav,
            message_to,
            message_subject,
            message_body,
        })
        return
        }
        next()
    }

     /* ******************************
    * Check data and return errors or continue to sending new message
    * ***************************** */
    validate.checkReplyMessageData = async (req, res, next) => {
        const { message_to, message_subject, message_body } = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/reply-message", {
            errors,
            title: message_subject,
            nav,
            message_to,
            message_subject,
            message_body,
        })
        return
        }
        next()
    }
  




module.exports = validate