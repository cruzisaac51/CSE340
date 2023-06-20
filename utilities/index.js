const invModel = require("../models/inventory-model");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
const Util = {}

  Util.getNav = async (req, res, next)=>{
    try {
      let data = await invModel.getClassifications();
      let list = "<ul class='nav-menu'>";
      list += '<li><a href="/" title="Home page">Home</a></li>';
      data.rows.forEach((row) => {
        list += "<li>";
        list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" class="active" title="See our inventory of ' +
          row.classification_name +
          ' vehicles">' +
          row.classification_name +
          "</a>";
        list += "</li>";
      });
      list += "</ul>";
      return list;
    } catch (error) {
      console.log("is here the errorr?", error);
      throw error;
    }
  }

  Util.getnewNav = async (req, res, next)=>{
    try {
      let data = await invModel.getClassifications();
      let list = "<ul class='nav-menu'>";
      list += '<li><a href="/" title="Home page">Home</a></li>';
      data.rows.forEach((row) => {
        list += "<li>";
        list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" class="active" title="See our inventory of ' +
          row.classification_name +
          ' vehicles">' +
          row.classification_name +
          "</a>";
        list += "</li>";
      });
      list += "</ul>";
      return list;
    } catch (error) {
      console.log("is here the errorr?", error);
      throw error;
    }
  }




  /* **************************************
  * Build the classification view HTML
  * ************************************ */
  Util.buildClassificationGrid = async (data)=>{ 
    try {
      let grid = "" 
      if(data.length > 0){ 
        grid = '<ul id="inv-display">' 
        data.forEach(vehicle => { 
          grid += '<li class="inv-displayli">'
          grid +=  '<a href="/inv/details/'+ vehicle.inv_id
          + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
          + 'details"><img src="' + vehicle.inv_thumbnail
          +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
          +' on CSE Motors"></a>'
          grid += '<div class="namePrice">'
          grid += '<h2>'
          grid += '<a href="/inv/details/' + vehicle.inv_id +'" title="View ' 
          + vehicle.inv_make + ' ' + vehicle.inv_model + '  details">' 
          + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
          grid += '</h2>'
          grid += '<span>$' 
          + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
          grid += '</div>'
          grid += '</li>'
        })
          grid += '</ul>'
        return grid
      } else {
            grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>' 
      } 
    } catch(error) {
      throw error;
      //console.error("buildClassificationGrid", error)
      //console.log("yoooo", data)
      
      //return ''
    }
  }

  /* **************************************
    * Build the Detail view HTML
  //   * ************************************ */
  Util.buildVehicleGrid = async(data1)=>{
    try {
      let grid1 = []
      console.log("yoooo", data1)
      if(data1.length > 0){ 
        grid1 += '<div class="bigscreen">'
        data1.forEach((vehicle1) =>{ 
          grid1 += '<section class="image-display">'
          grid1 += `<img src="${vehicle1.inv_image}" alt="Image of ${vehicle1.inv_make} ${vehicle1.inv_model} on CSE Motors">`
          grid1 += '</section>'
          grid1 += '<section class="details-display">'
          grid1 += `<h3>${vehicle1.inv_make} ${vehicle1.inv_model} Details</h3>`;
          grid1 += `<span>Price:$${vehicle1.inv_price.toLocaleString('en-US')}</span>`;
          grid1 += `<p>Description:${vehicle1.inv_description}</p>`;
          grid1 += `<p>Color:${vehicle1.inv_color}</p>`;
          grid1 += `<p>Miles:${vehicle1.inv_miles}</p>`;
          grid1 += '</section>'
          
        })
          grid1 += '</div>'
        return grid1
      }else {
        grid1 += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
      }    
      
    } catch (error) {
        console.error("buildClassificationGrid", error)
        //console.log("yoooo1", data1)
        return ''
    }
  }

  /* **************************************
    * Build the user account view HTML
  //   * ************************************ */
  Util.builduseracountGrid = async()=>{

    let grid = []
    grid += `<h3>You're logged in.</h3>`
    grid +=`<div class="linksmanagement">`
    grid +=`<a href="/inv/addclassification/" title="edit acount information" class="anchorsmanagement">Edit acount information</a>`
    grid +=`</div>`

    return grid
  }


    /* **************************************
    * Build the add inventory view HTML
    ************************************* */
  Util.buildaddnewcarform = async(req, res, next)=>{
    try {
      let data = await invModel.getClassifications();
      let grid = []
      for (let row of data.rows) {
        grid += `<option value="${row.classification_id}">${row.classification_name}</option>`;
      }
        return grid
    } catch (error) {
      console.log("is here the errorr?---", error);
      throw error;
    }
  }

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
  Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

  Util.intentionalerror = (req, res, next) => {
    try {
      throw new Error('Intentional error');
    } catch (error) {
      next(error);
    }
  }

  /* ****************************************
* Middleware to check token validity
**************************************** */
  Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, regResult) {
      if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("./account/login")
      }
      res.locals.regResult = regResult
      res.locals.loggedin = 1
      next()
      })
    } else {
    next()
    }
  }

  /* ****************************************
 *  Check Login
 * ************************************ */
  Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
      next()
    } else {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }
  }



module.exports = Util

