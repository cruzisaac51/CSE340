const path = require("path");
const utilities = require("../utilities/")

const loginbuild = {}
/* ****************************************
*  Deliver login view
* *************************************** */
loginbuild.buildLogin = async function(req, res){
    let login = await utilities.builduserlogin()
        let skrp = '<script>' + `                
                    document.querySelector("#showPass").addEventListener("click", () =>{
                    const checkbox = document.getElementById("password");
                    if (checkbox.type === "password") {
                        checkbox.type = "text";
                    }else {
                        checkbox.type = "password";
                    };
                });`
        skrp +='</script>';
    let nav = await utilities.getNav()
    res.render("./account/login", {
    title: "Sign in",
    nav,
    login,
    skrp
    });
}


loginbuild.buildregistration = async function(req, res){
    let register = await utilities.builduserregristation()
    let skrp = '<script>' + `                
                    document.querySelector("#showPass").addEventListener("click", () =>{
                    const checkbox = document.getElementById("password");
                    if (checkbox.type === "password") {
                        checkbox.type = "text";
                    }else {
                        checkbox.type = "password";
                    };
                });`
        skrp +='</script>';
    let nav = await utilities.getNav()
    res.render("./account/registration", {
      title: "Sign up",
      nav,
      register,
      skrp
    })
  }
  
  module.exports = loginbuild