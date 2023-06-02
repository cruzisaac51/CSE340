const path = require("path");
const utilities = require("../utilities/")
const accountModel = require("../models/account-model");



class LoginBuild {

    constructor() {
    }

    // Methods

    async buildLogin(req, res) {
        let login = await utilities.builduserlogin();
        let skrp = '<script>' + `document.querySelector("#showPass").addEventListener("click", () =>{ const checkbox = document.getElementById("password"); if (checkbox.type === "password") { checkbox.type = "text"; }else { checkbox.type = "password"; }; })`;
        skrp +='</script>';
        let nav = await utilities.getNav();
        return res.render("./account/login", {
        title: "Sign in",
        nav,
        login,
        skrp
        });
    }

    async buildregistration(req, res) {
        let register = await utilities.builduserregristation();
        let skrp = '<script>' + `document.querySelector("#showPass").addEventListener("click", () =>{ const checkbox = document.getElementById("password"); if (checkbox.type === "password") { checkbox.type = "text"; }else { checkbox.type = "password"; }; })`;
        skrp +='</script>';
        let nav = await utilities.getNav();
        return res.render("./account/registration", {
        title: "Sign up",
        nav,
        register,
        skrp
        });
    }

    async registeruserAccount(req, res) {
        let login = await utilities.builduserlogin();
        let skrp = '<script>' + `document.querySelector("#showPass").addEventListener("click", () =>{ const checkbox = document.getElementById("password"); if (checkbox.type === "password") { checkbox.type = "text"; }else { checkbox.type = "password"; }; })`;
        skrp +='</script>';
        let nav = await utilities.getNav();
        const { account_firstname, account_lastname, account_email, account_password } = req.body;
        const regResult = await accountModel.registerAccount(account_firstname,account_lastname,account_email,account_password)
        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you're registered ${account_firstname}. Please log in.`
            )
            return res.status(201).render("./account/login", {
                title: "Sign in",
                nav,
                login,
                skrp
            });
        } else {
            req.flash("notice", "Sorry, the registration failed.")
            return res.status(501).render("./account/registration", {
                title: "Registration",
                nav,
                errors: null,
            })
        }
    }
    

}

module.exports = LoginBuild