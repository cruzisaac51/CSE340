const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
  /* ***************************
  *  Build inventory by classification view
  * ************************** */
  invCont.buildByClassificationId  = async(req, res, next) =>{
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    //console.log("build", className)
    const grid = await utilities.buildClassificationGrid(data)
    res.render("./inventory/classification", {
      title: `${className}  vehicles`,
      nav,
      grid,
    })
  }




  /* ***************************
  *  Build specific inventory item detail view.
  * ************************** */

  invCont.buildById = async (req, res, next) => {
    const inv_id = req.params.invId
    const data1 = await invModel.getVehicleById(inv_id)
    const yearv = data1[0].inv_year
    const makev = data1[0].inv_make
    const modelv = data1[0].inv_model
    const title = `${yearv} ${makev} ${modelv}`
    const grid1 = await utilities.buildVehicleGrid(data1)
    //console.log("data1", data1);
    const nav = await utilities.getNav()
    res.render("./inventory/details", {
      title: `${title}`,
      nav,
      grid1,
    })
  }

module.exports = invCont

