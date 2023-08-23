// Needed Resources 
const express = require("express")
const router = new express.Router() 
const LoginBuild = require("../controllers/accountController");
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const managevalidate = require("../utilities/vehiclemanageValidastion")
const vmanage = require("../controllers/manageController")
const logregbuild = new LoginBuild()



     /* ***************************
    *   views
    * ************************** */

//routes vehicle management routes authorization view
router.get('/', utilities.checkLogin, logregbuild.clientnotAuth, utilities.handleErrors(vmanage.buildmanageview))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build a specific inventory item detail view.
router.get("/details/:invId", utilities.handleErrors(invController.buildById));

//route to add a new classification view
router.get('/addclassification/', utilities.handleErrors(vmanage.buildaddclassview))

// route to add a new item on the inventory view
router.get('/addinventory/', utilities.handleErrors(vmanage.buildaddvehicleview))

     /* ***************************
    *  json data to get info from inventory and classifications
    * ************************** */

// route to get the json data
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// route to edit and item from the inventory
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

//route to delete the inventory
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView))

     /* ***************************
    *  Add, Update, and Delete from the inventory and classification to the database
    * ************************** */

// routes to post on the database a new classification
router.post('/addclassification/',  managevalidate.addclassificationRules(), managevalidate.checkaddclassData, utilities.handleErrors(vmanage.registernewclassification))

// routes to post on the database a new item
router.post('/addinventory/',  managevalidate.addcarRules(), managevalidate.checkaddcarData, utilities.handleErrors(vmanage.registernewvehicle))

// router to post the edit of a new item on the inventory
router.post('/update/', managevalidate.newInventoryRules(), managevalidate.checkUpdateData,  utilities.handleErrors(invController.updateInventory))

// router to delete the specified item on the inventory
router.post('/delete/', utilities.handleErrors(invController.deleteItem))


module.exports = router