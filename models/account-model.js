const pool = require("../database/")

const accModel = {}

/* *****************************
*   Register new account
* *************************** */
    accModel.registerAccount = async (account_firstname, account_lastname, account_email, account_password) =>{
        try {
        const sql = await pool.query(
            "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *",
            [account_firstname, account_lastname, account_email, account_password]
        )
            return sql
        } catch (error) {
        return error.message
        }
    }


    // accModel.getaccount = async () => {
    //     return await pool.query("SELECT * FROM public.account ORDER BY account_id")
    // }

    
module.exports = accModel