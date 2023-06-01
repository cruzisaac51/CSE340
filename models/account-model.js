const pool = require("../database/")

const accModel = {}

/* *****************************
*   Register new account
* *************************** */
    accModel.registerAccount = async (account_firstname, account_lastname, account_email, account_password) =>{
        try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
        } catch (error) {
        return error.message
        }
    }


    // accModel.getaccount = async () => {
    //     return await pool.query("SELECT * FROM public.account ORDER BY account_id")
    // }

    
module.exports = accModel