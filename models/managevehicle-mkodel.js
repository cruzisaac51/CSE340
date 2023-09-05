const pool = require("../database/")

const manageModel = {}

/* *****************************
*   Register new classification
* *************************** */
manageModel.registernewclassification = async (classification_name) =>{
    try {
    const sqlnewclass = await pool.query(
        "INSERT INTO public.classification (classification_id, classification_name) values  (nextval('serial'),$1) returning *",
        [classification_name]
    )
    console.log("maybecsqlhere",sqlnewclass)
        return sqlnewclass
    } catch (error) {
    return error.message
    }
}

    /* **********************
 *   Check for existing classification
 * ********************* */
    manageModel.checkExistingClassification = async (classification_name) =>{
        try {
            const sqlclass = "SELECT * FROM public.classification WHERE classification_name = $1"
            const classification = await pool.query(sqlclass, [classification_name])
            return classification.rowCount
        } catch (error) {
            return error.message
        }
    }


/* *****************************
*   Register new vehicle
* *************************** */
manageModel.registernewvehicle = async (inv_image, inv_thumbnail, classification_id,inv_make, inv_model, inv_description, inv_price, inv_year,inv_miles, inv_color) =>{
    try {
    const sqlnewcar = await pool.query(
        "INSERT INTO public.inventory (inv_image, inv_thumbnail,classification_id,inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color) values  ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *",
        [inv_image, inv_thumbnail, classification_id,inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color]
    )
    //console.log("maybecsqlhere",sqlnewclass)
        return sqlnewcar
    } catch (error) {
    return error.message
    }
}



    /* **********************
 *   Check for inventory
 * ********************* */
    manageModel.checkmatchinventory = async () =>{
        try {
            return await pool.query("SELECT * FROM public.inventory ORDER BY inv_id ASC");
        } catch (error) {
            return error.message
        }
    }

module.exports = manageModel
