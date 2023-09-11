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
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_description: itemData[0].inv_description,
      inv_image: itemData[0].inv_image,
      inv_thumbnail: itemData[0].inv_thumbnail,
      inv_price: itemData[0].inv_price,
      inv_year: itemData[0].inv_year,
      inv_miles: itemData[0].inv_miles,
      inv_color: itemData[0].inv_color,
      classification_id: itemData[0].classification_id,
      inv_id: itemData[0].inv_id,
    })
  }



     /* ***************************
    *  check edit vehicle view.
    * ************************** */

  invCont.updateInventory = async(req, res) => {
    let nav = await utilities.getNav();
    const {
      classificationcars,
      edit_makename,  
      edit_modelname, 
      edit_description, 
      edit_imagepath, 
      edit_thumbnailpath, 
      edit_price, edit_year, 
      edit_miles, edit_color,
      inv_id
    } = await req.body;
    const updateResult = await invModel.updateInventory(
      edit_makename,  
      edit_modelname, 
      edit_description, 
      edit_imagepath, 
      edit_thumbnailpath, 
      edit_price, edit_year, 
      edit_miles, 
      edit_color, 
      classificationcars, 
      inv_id
      )

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      
      const itemData = await invModel.getVehicleById(inv_id)
      const grid = await utilities.buildaddnewcarform()
      const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("./inventory/editinventory", {
        title: "Edit " + itemName,
        nav,
        grid,
        classification_name: itemData[0].classification_name,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_description: itemData[0].inv_description,
        inv_image: itemData[0].inv_image,
        inv_thumbnail: itemData[0].inv_thumbnail,
        inv_price: itemData[0].inv_price,
        inv_year: itemData[0].inv_year,
        inv_miles: itemData[0].inv_miles,
        inv_color: itemData[0].inv_color,
        classification_id: itemData[0].classification_id,
        inv_id: itemData[0].inv_id,
      })
    }
  }





    /* ***************************
  *  Build delete inventory view
  * ************************** */
  invCont.deleteView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/deleteconfirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_price: itemData[0].inv_price,
      inv_year: itemData[0].inv_year,
      inv_miles: itemData[0].inv_miles,
      inv_id: itemData[0].inv_id,
    })
  }



     /* ***************************
    *  check Deletation vehicle view.
    * ************************** */
  invCont.deleteItem = async (req, res, next) =>{
    let nav = await utilities.getNav()
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)
    if (deleteResult) {
      req.flash("notice", 'The deletion was successful.')
      res.redirect('/inv/')
    } else {
      req.flash("notice", 'Sorry, the delete failed.')
      res.redirect('/inv/delete/inv_id')
    }
  }  

module.exports = invCont

