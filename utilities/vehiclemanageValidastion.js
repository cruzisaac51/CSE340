const utilities = require(".")
const manageModel = require("../models/managevehicle-mkodel")
const invModel = require("../models/inventory-model");
var validator = require('validator');
const { body, validationResult, matchedData} = require("express-validator")


const managevalidate = {}



    /*  **********************************
    *  add new classification Data Validation Rules
    * ********************************* */
    managevalidate.addclassificationRules = () => {
        return [
            // firstname is required and must be string
            body("add_classificationname")
            .trim()
            .isString()
            .isLength({ min: 2 })
            .withMessage("Please provide a valid classification name.") // on error this message is sent.
            .custom(async (add_classificationname) => {
                const classExists = await manageModel.checkExistingClassification(add_classificationname)
                if (classExists){
                    throw new Error("classification exists. Please use different classification")
                } else {

                }
            }),
        ]
        
    }

    /* ******************************
    * Check data and return errors or continue to add classifications
    * ***************************** */
    managevalidate.checkaddclassData = async (req, res, next) => {
        const { add_classificationname } = req.body
        let errors = []
        errors = validationResult(req)
        console.log("maybevalitaionher1e",errors)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            res.render("./inventory/addclassification", {
                errors,
                title: "vehicle new classification",
                nav,
                add_classificationname,
            })
            return
        }
        next()
    }




    /*  **********************************
    *  add new car Data Validation Rules
    * ********************************* */
    //const data = await invModel.getClassifications();
    managevalidate.addcarRules = () => {
        return [
            body("classificationcars")
            .isString()
            .withMessage("Please choose a classification.")
            .custom(async (value, {req}) => {
                const classidExists = await invModel.getClassifications()
                if (!classidExists == (value)) {
                    throw new Error("classification exists. Please use different classification")
                }
            }),

            body("add_makename")
                .trim()
                .isLength({ min: 2 })
                .withMessage("Please provide a Make name."),

            body("add_modelname")
                .trim()
                .isLength({ min: 2 })
                .withMessage("Please provide a Model name."),

            body("add_description")
                .notEmpty()
                .trim()
                .isString()
                .isLength({ min: 2 })
                .withMessage("Please provide a description.")
                .custom(async (value, {req}) => {
                    const invetroytype = await manageModel.checkmatchinventory()
                    const texttype = invetroytype.inv_description
                    console.log("what kindoftypoeis this",texttype)
                    if (!texttype == (value) ) {
                        throw new Error("insert valid text")
                    }
                }), 

            body("add_price")
                .trim()
                .isNumeric()
                .withMessage("Please provide a price."),

            body("add_year")
                .trim()
                .isInt()
                .withMessage("Please provide a 4 digits Year."),

            body("add_miles")
                .trim()
                .isInt()
                .withMessage("Please provide just numbers."),

            body("add_color")
                .trim()
                .isString()
                .isLength({ min: 2 })
                .withMessage("Please provide a Color"),
        ]
        
    }


    /* ******************************
    * Check data and return errors or continue to add New Vehicle
    * ***************************** */
    managevalidate.checkaddcarData = async (req, res, next) => {
        const { classificationcars,add_makename,  add_modelname,add_description,add_price,add_year,add_miles,add_color } = req.body;
        let errors = []
        errors = validationResult(req)
        console.log("maybevalitaionhere",errors)
        if (!errors.isEmpty()) {
            console.log("maybevalitaionhere",errors[0])
            const grid = await utilities.buildaddnewcarform()
            let nav = await utilities.getNav()
            res.render("./inventory/addinventory", {
                errors,
                title: "New vehicle",
                nav,
                grid,
                classificationcars,
                add_makename,  
                add_modelname,
                add_description,
                add_price,
                add_year,
                add_miles,
                add_color,
            })
            return
        }
        next()
    }






        /*  **********************************
    *  Edit car Data Validation Rules
    * ********************************* */
    //const data = await invModel.getClassifications();
    managevalidate.newInventoryRules = () => {
        return [
            body("classificationcars")
            .notEmpty()
            .isString()
            .withMessage("Please choose a classification."),

            body("edit_makename")
                .trim()
                .isLength({ min: 2 })
                .withMessage("Please provide a Make name."),

            body("edit_modelname")
                .trim()
                .isLength({ min: 2 })
                .withMessage("Please provide a Model name."),

            body("edit_description")
                .notEmpty()
                .trim()
                .isString()
                .isLength({ min: 2 })
                .withMessage("Please provide a description."),

           body("edit_imagepath")
                .trim()
                .isString()
                .notEmpty()
                .withMessage("insert valid path"),

            body("edit_thumbnailpath")
                .trim()
                .isString() 
                .notEmpty()
                .withMessage("insert valid path"),

            body("edit_price")
                .trim()
                .isInt()
                .withMessage("Please provide a price."),

            body("edit_year")
                .trim()
                .isInt()
                .withMessage("Please provide a 4 digits Year."),

            body("edit_miles")
                .trim()
                .isInt()
                .withMessage("Please provide just numbers."),

            body("edit_color")
                .trim()
                .isString()
                .isLength({ min: 2 })
                .withMessage("Please provide a Color"),
        ]
        
    }

     /* ******************************
    * Check data and return errors or continue to edit Vehicle
    * ***************************** */
     managevalidate.checkUpdateData = async (req, res, next) => {
        const {classificationcars, edit_makename,  edit_modelname, edit_description, edit_imagepath, edit_thumbnailpath, edit_price, edit_year, edit_miles, edit_color, inv_id } = req.body;
        let errors = []
        errors = validationResult(req)
        console.log("maybevalitaionhere",errors)
        if (!errors.isEmpty()) {
            console.log("maybevalitaionhere",errors[0])
            const grid = await utilities.buildaddnewcarform()
            let nav = await utilities.getNav()
            const itemData = await invModel.getVehicleById(inv_id)
            const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
            res.render("./inventory/editinventory", {
                errors,
                title: "Edit " + itemName,
                nav,
                grid,
                classification_name: itemData[0].classification_name,
                inv_make:edit_makename,  
                inv_model:edit_modelname,
                inv_description:edit_description,
                inv_image:edit_imagepath,
                inv_thumbnail:edit_thumbnailpath,
                inv_price:edit_price,
                inv_year:edit_year,
                inv_miles:edit_miles,
                inv_color:edit_color,
                classification_id: classificationcars,
                inv_id,
            })
            return
        }
        next()
    }

module.exports = managevalidate