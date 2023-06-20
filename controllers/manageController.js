const utilities = require("../utilities/")
const manageModel = require("../models/managevehicle-mkodel")


const manageCont = {}

    manageCont.buildmanageview  = async(req, res, next) =>{
        let nav = await utilities.getNav()
        const classificationSelect = await utilities.buildaddnewcarform()
        res.render("./inventory/management", {
        title: 'vehicle management',
        nav,
        errors: null,
        classificationSelect,
        })
    }

    manageCont.buildaddclassview  = async(req, res, next) =>{
        let nav = await utilities.getNav()
        res.render("./inventory/addclassification", {
        title: 'vehicle new classification',
        nav,
        errors: null,
        })
    }

    manageCont.buildaddvehicleview  = async(req, res, next) =>{
        const grid = await utilities.buildaddnewcarform()
        let nav = await utilities.getNav()
        res.render("./inventory/addinventory", {
        title: ' New vehicle ',
        nav,
        grid,
        errors: null,
        })
    }


    /* ***************************
    *  check add new classification view.
    * ************************** */

    manageCont.registernewclassification = async(req, res) => {
        let nav = await utilities.getNav();
        const grid = await utilities.buildmanagementGrid();
        const { add_classificationname } = req.body;
        const regResult = await manageModel.registernewclassification(add_classificationname);
        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you registered a new classification.`
            )
            let newnav = await utilities.getnewNav();
            return res.status(201).render("./inventory/management", {
                title: 'vehicle management',
                nav : `${newnav}`,
                grid,
                errors: null,
            })
        } else {
            req.flash("notice", "Sorry, the registration failed.")
            return res.status(401).render("./inventory/addclassification", {
                title: 'vehicle new classification',
                nav,
                errors: null,
            });
        }
    }

     /* ***************************
    *  check add new vehicle view.
    * ************************** */

     manageCont.registernewvehicle = async(req, res) => {
        let nav = await utilities.getNav();
        const grid = await utilities.buildmanagementGrid()
        const grid1 = await utilities.buildaddnewcarform()
        const { classificationcars,add_makename,  add_modelname,add_description,add_price,add_year,add_miles,add_color } = req.body;
        const regResult = await manageModel.registernewvehicle(classificationcars,add_makename,  add_modelname,add_description,add_price,add_year,add_miles,add_color)

        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you registered a new Vehicle.`
            )
            console.log("what are the values?",regResult)
            return res.status(201).render("./inventory/management", {
                title: 'vehicle management',
                nav,
                grid,
                errors: null,
            })
        } else {
            req.flash("notice", "Sorry, the registration failed.")
            return res.status(401).render("./inventory/addinventory", {
                title: 'vehicle new classification',
                nav,
                grid : `${grid1}`,
                errors: null,
            });
        }
    }


module.exports = manageCont