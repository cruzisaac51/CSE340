const utilities = require("../utilities/")
const manageModel = require("../models/managevehicle-mkodel")
const accountModel = require("../models/account-model");
const multer = require("multer")


const manageCont = {}

    manageCont.buildmanageview  = async(req, res, next) =>{
        let nav = await utilities.getNav()
        const account_id = parseInt(req.params.accId)
        const updateResult = await accountModel.infoUserAcount(account_id)
        const classificationSelect = await utilities.buildaddnewcarform()
        res.render("./inventory/management", {
        title: 'vehicle management',
        nav,
        errors: null,
        classificationSelect,
        account_id: updateResult.account_id,
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
        const account_id = parseInt(req.params.accId)
        const classificationSelect = await utilities.buildaddnewcarform()
        const updateResult = await accountModel.infoUserAcount(account_id)
        const { add_classificationname } = req.body;
        const regResult = await manageModel.registernewclassification(add_classificationname);
        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you registered a new classification.`
            )
            return res.status(201).redirect("/inv/")
        } else {
            req.flash("notice", "Sorry, the registration failed.")
            return res.status(501).render("./inventory/addclassification", {
                title: 'vehicle new classification',
                nav,
                errors: null,
            });
        }
    }

     /* ***************************
    *  check add new vehicle view.
    * ************************** */

     const storage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, "./images/vehicles" )
        },
        filename: function (req, file, cb){
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
     manageCont.registernewvehicle = async(req, res) => {
        let nav = await utilities.getNav();
        const grid1 = await utilities.buildaddnewcarform()
        const upload = multer({ storage: storage})
        upload.fields([{ name: 'add_imagepath' }, { name: 'add_thumbnailpath' }])
        const { files } = req;
        // Ahora puedes acceder a las rutas de las imágenes en files.image y files.thumbnail
        const imageFilePath = files.add_imagepath[0].path;
        const thumbnailFilePath = files.add_thumbnailpath[0].path;
        const {add_imagepath, add_thumbnailpath, classificationcars,add_makename,  add_modelname,add_description,add_price,add_year,add_miles,add_color } = req.body;
        const regResult = await manageModel.registernewvehicle(imageFilePath, thumbnailFilePath, classificationcars,add_makename,  add_modelname,add_description,add_price,add_year,add_miles,add_color)
        console.log("image and thumbnail values",add_imagepath, add_thumbnailpath)
        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you registered a new Vehicle.`
            )
            console.log("what are the values?",regResult)
            return res.status(201).redirect("/inv/")
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