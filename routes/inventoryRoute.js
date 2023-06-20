// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const managevalidate = require("../utilities/vehiclemanageValidastion")
const vmanage = require("../controllers/manageController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build a specific inventory item detail view.
router.get("/details/:invId", utilities.handleErrors(invController.buildById));

//provisional routes vehicle management routes
router.get('/', utilities.handleErrors(vmanage.buildmanageview))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))
router.get('/addclassification/', utilities.handleErrors(vmanage.buildaddclassview))
router.get('/addinventory/', utilities.handleErrors(vmanage.buildaddvehicleview))
router.post('/addclassification/',  managevalidate.addclassificationRules(), managevalidate.checkaddclassData, utilities.handleErrors(vmanage.registernewclassification))
router.post('/addinventory/',  managevalidate.addcarRules(), managevalidate.checkaddcarData, utilities.handleErrors(vmanage.registernewvehicle))


module.exports = router