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




  /* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}



/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const grid = await utilities.buildaddnewcarform()
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/editinventory", {
    title: "Edit " + itemName,
    nav,
    grid,
    errors: null,
    classification_name: itemData[0].classification_name,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}


module.exports = invCont

