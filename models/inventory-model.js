const pool = require("../database/")

const invModel = {}

  /* ***************************
  *  Get all classification data
  * ************************** */
  invModel.getClassifications = async()=>{
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
  }






  /* ***************************
  *  Get all inventory items and classification_name by classification_id
  * ************************** */
  invModel.getInventoryByClassificationId = async(classification_id) =>{
      try {
        const data = await pool.query(
          "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id  WHERE i.classification_id = $1",
          [classification_id]
        )
        return data.rows;
      } catch (error) {
        console.error("getclassificationsbyid error " + error)
        throw error
      }
  }

  /* ***************************
  *  Get all inventory items and classification_name by classification_id
  * ************************** */

  invModel.getVehicleById = async(inv_id) =>{
    try {
      const data1 = await pool.query(
        "SELECT * FROM public.inventory AS i INNER JOIN public.classification AS c on c.classification_id = i.classification_id WHERE i.inv_id IN ($1)",
        [inv_id]
      )
      if(data1.rows.length > 0){
        return data1.rows;
      }else{
        return null;
      }
    } catch (error) {
    console.error("getvehiclebyid error " + error)
    throw error
    }
  }

module.exports = invModel