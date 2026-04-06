const express = require("express")
const router = new express.Router() 
const partController = require("../controllers/partController")
const utilities = require("../utilities/")

// Route to build parts inventory view
router.get("/", utilities.handleErrors(partController.buildPartsInventory));

// Route to sort parts
router.get("/sort/:sortMethod", utilities.handleErrors(partController.buildPartsInventory));


module.exports = router;
