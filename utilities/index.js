const invModel = require("../models/inventory-model")
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

