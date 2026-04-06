const partModel = require("../models/part-model")
const utilities = require("../utilities/")

const partCont = {}

/* ***************************
 *  Build Parts Inventory View
 * ************************** */
partCont.buildPartsInventory = async (req, res, next) => {
  try {
    // Check if there is a sort param
    let sortBy = req.params.sortMethod;
    if (!sortBy || (sortBy !== 'ASC' && sortBy !== 'DESC')) {
        sortBy = 'ASC'; // default
    }
    
    // Fetch parts
    const data = await partModel.getParts(sortBy);
    
    // Check utilities buildPartsGrid
    const grid = await utilities.buildPartsGrid(data);
    
    // Get generic nav
    let nav = await utilities.getNav();
    
    res.render("./inventory/parts", {
      title: "Upgrades & Parts Inventory",
      nav,
      grid,
      errors: null,
      sortBy
    });
  } catch (error) {
    next(error);
  }
}

module.exports = partCont;
