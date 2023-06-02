const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model");
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
const Util = {}

  Util.getNav = async (req, res, next)=>{
    try {
      let data = await invModel.getClassifications();
      let list = "<ul>";
      list += '<li><a href="/" title="Home page">Home</a></li>';
      data.rows.forEach((row) => {
        list += "<li>";
        list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" title="See our inventory of ' +
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
          grid += '<li id="inv-displayli">'
          grid +=  '<a href="/inv/details/'+ vehicle.inv_id
          + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
          + 'details"><img src="' + vehicle.inv_thumbnail
          +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
          +' on CSE Motors" /></a>'
          grid += '<div class="namePrice">'
          grid += '<hr />'
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
          grid1 += `<img src="${vehicle1.inv_image}" alt="Image of ${vehicle1.inv_make} ${vehicle1.inv_model} on CSE Motors" />`
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




  Util.builduserlogin = async(req, res, next)=>{
    try{
      let form1 = '<form action="/login" method="post" id="loginform">'
      form1 += '<label for="email"> Email Address</label>'
      form1 += '<input type="email" name="email" id="email" autocomplete="email" required>'
      form1 += '<label for="password"> Password </label>'
      form1 += `<input type="password" name="password" id="password" class="checkaligne" autocomplete="current-password" required><input type="checkbox" class="custom-checkbox" id="showPass">`;
      form1 += '<p>Password must be at least 12 characters contain at least 1 capital letter, contain at least 1 number, contain at least 1 special character</p>'
      form1 += '<button type="submit" form="loginform" value="Login">Submit</button>'
      form1 += '<h2 class="signup"> No Account? <a href="/account/registration">sign-up</a></h2>'
      form1 += '</form>';
       
      return form1;
    }catch(error){
      console.error("builduserlogin", error)
      //console.log("yoooo1", data1)
      return ''
    }
  }


  Util.builduserregristation = async (req, res, next)=>{
    try {
      let form2 = '<form action="/account/registration" method="post" id="registerform">'
        form2 += '<label for="name"> First Name</label>'
        form2 += '<input type="name" name="account_firstname" id="name" required autocomplete="given-name">'
        form2 += '<label for="lastname"> Last Name</label>'
        form2 += '<input type="lastname" name="account_lastname" id="lastname" required autocomplete="family-name">'
        form2 += '<label for="email"> Email Address</label>'
        form2 += '<input type="email" name="account_email" id="email" required autocomplete="email">'
        form2 += '<label for="password"> Password </label>'
        form2 += `<input type="password" name="account_password" id="password" class="checkaligne" autocomplete="new-password" required><input type="checkbox" class="custom-checkbox" id="showPass">`;
        form2 += '<p>Password must be at least 12 characters contain at least 1 capital letter, contain at least 1 number, contain at least 1 special character</p>'
        form2 += '<button type="submit" form="registerform" value="register">Register</button>'
        form2 += '</form>';


      return form2;
      
    } catch (error) {
      console.error("builduserregistration", error)
      //console.log("yoooo1", data1)
      return ''
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



module.exports = Util

