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
        const account_id = parseInt(req.params.account_id)
        const updateResult = await accountModel.infoUserAcount(account_id)
        console.log("what account id is ?",account_id)
        res.render("./account/userportal", {
        title: 'Account management',
        nav,
        errors: null,
        account_id: updateResult[0].account_id,
        })
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
                ///////////////////////////////
                const getaccountid1 = (decodedToken) => {
                    const accountid1 = decodedToken["account_id"]
                    return accountid1
                }
                let accountid1 = getaccountid1(decodedToken)
                res.locals.accountid1 = accountid1

              console.log("this is the decodedtoken",decodedToken);
              console.log("this is the accounttype",accounttype);
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
                        res.redirect('/')
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
        const account_id = parseInt(req.params.account_id)
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
        const account_id = parseInt(req.params.account_id)
        const userdata = await accountModel.infoUserAcount(account_id)
        let nav = await utilities.getNav();
        return res.render("./account/edituserinfo", {
        title: "Edit Your Account",
        nav,
        errors: null,
        account_firstname: userdata[0].account_firstname,
        account_lastname: userdata[0].account_lastname,
        account_email: userdata[0].account_email,
        account_id,
        });
    }



     /* ***************************
    *  check edit Account view.
    * ************************** */

    async editAccount(req, res){
        let nav = await utilities.getNav();
        const {edit_firstname, edit_lastname, edit_email, account_id} = req.body;
        const {edit_password } = req.body;
        const updateResult = await accountModel.editAccount(edit_firstname, edit_lastname, edit_email, account_id)
        console.log("updateresultwyoyoot",updateResult)
        let hashedPassword
        try {
            // regular password and cost (salt is generated automatically)
            hashedPassword = await bcrypt.hashSync(edit_password, 10)
        } catch (error) {
          const userdata = await accountModel.infoUserAcount(updateResult)
          console.log('343435',userdata)
            req.flash("notice", 'Sorry, there was an error processing the update password.')
            res.status(501).render("./account/edituserinfo", {
                title: "Edit Your Account",
                nav,
                errors: null,
                account_firstname: userdata[0].account_firstname,
                account_lastname: userdata[0].account_lastname,
                account_email: userdata[0].account_email,
                account_id,
            });
        }
        const updateResult1 = await accountModel.editpasswordAccount(hashedPassword,account_id)
        console.log("updateresultw7777yoyoot",updateResult)
        if (updateResult || updateResult1) {
          req.flash("notice", "Your account was successfully updated.")
          res.redirect("/account/")
        } else {
          const userdata = await accountModel.infoUserAcount(updateResult)
          req.flash("notice", "Sorry, the update failed.")
          res.status(501).render("./account/edituserinfo", {
            title: "Edit Your Account",
            nav,
            errors: null,
            account_firstname: userdata[0].account_firstname,
            account_lastname: userdata[0].account_lastname,
            account_email: userdata[0].account_email,
            account_id,
            });
        }
    }
 

}

module.exports = LoginBuild