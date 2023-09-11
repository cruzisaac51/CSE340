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




  /* ***************************
 *  Update Inventory Data
 * ************************** */
invModel.updateInventory = async(
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id,
  inv_id
) =>{
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    console.log("updateinventory",sql)
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


  /* ***************************
  *  Delete inventory item
  * ************************** */

  invModel.deleteInventoryItem = async(inv_id) =>{
    try {
      const data1 = await pool.query(
        " DELETE FROM public.inventory WHERE inv_id = $1",
        [inv_id]
      )
        return data1
    } catch (error) {
      console.error("getvehiclebyid error " + error)
      new Error("Delete Inventory Item failed")
    }
  }

module.exports = invModel