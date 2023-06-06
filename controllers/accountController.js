const path = require("path");
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model");
const { body } = require("express-validator")



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
    *  check login view.
    * ************************** */

    async loginuserAccount(req, res) {
        let nav = await utilities.getNav();
        const { account_email, account_password } = req.body;
        const regResult = await accountModel.loginUserAcount(account_email,account_password)
        if (regResult) {
            req.flash("notice", "Welcome");
            return res.status(201).render("./", {
            title: "Home",
            nav,
            });
        } else {
            req.flash("notice", "Sorry, the registration failed.")
            console.log("email??error");
            return res.status(401).render("./account/login", {
                title: "Sign in",
                nav,
                errors: null,
            })
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
            res.status(500).render("account/registration", {
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
    

}

module.exports = LoginBuild