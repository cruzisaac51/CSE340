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
        const grid = await utilities.builduseracountGrid()
        res.render("./account/userportal", {
        title: 'Acount management',
        nav,
        grid,
        })
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
                const nameuser = await accountModel.infoUserAcount(account_email);
                const account_firstname = nameuser[0].account_firstname;
                req.flash("notice", `Welcome ${account_firstname}`);
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