const pool = require("../database/")

const accModel = {}

/* *****************************
*   login account
* *************************** */
    accModel.loginUserAcount = async (account_email, account_password) =>{
        try {
            const datalog = "SELECT  *  FROM public.account  where account_email= $1 and account_password= $2 "
            const accesornot = await pool.query(datalog,[account_email, account_password])
            return accesornot
        } catch (error) {
            return error.message
        }
    }

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


    /* **********************
 *   Check for existing email
 * ********************* */
    accModel.checkExistingEmail = async (account_email) =>{
        try {
            const sqlemail = await pool.query(
                "SELECT * FROM account WHERE account_email = $1",
                [account_email]
            )
            return sqlemail.rows[0]
        } catch (error) {
            return error.message
        }
    }
    accModel.checkExistingPassword = async (account_password) =>{
        try {
            const sql1 = "SELECT * FROM account WHERE account_password = $1"
            const password = await pool.query(sql1, [account_password])
            return password
        } catch (error) {
            return error.message
        }
    }


    /* *****************************
    *   Assignment 5
    * *************************** */

    /* *****************************
    *   get account
    * *************************** */

    accModel.infoUserAcount = async (account_id) =>{
        try {
            const datainfouser = await pool.query(
                "SELECT * FROM public.account WHERE account_id = $1",
                [account_id]
            )
            console.log("queryinfouser",datainfouser)
                return datainfouser.rows
        } catch (error) {
            return error.message
        }
    }
    accModel.infoUserAcount1 = async () =>{
        try {
            const datainfouser = await pool.query(
                "SELECT  *  FROM public.account ORDER BY account_id ASC"
            )
            return datainfouser.rows
        } catch (error) {
            return error.message
        }
    }

    /* *****************************
    *   Edit account
    * *************************** */
    accModel.editAccount = async (account_firstname, account_lastname, account_email, account_id) =>{
        try {
        const sql = await pool.query(
            "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *",
            [account_firstname, account_lastname, account_email, account_id]
        )
            return sql.rows[0]
        } catch (error) {
            console.error("model editaccount error: " + error)
            return error.message
        }
    }

    /* *****************************
    *   Edit Password
    * *************************** */
    accModel.editpasswordAccount = async (account_password, account_id) =>{
        try {
        const sql = await pool.query(
            "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *",
            [account_password, account_id]
        )
            return sql.rows[0]
        } catch (error) {
            console.error("model editpassword error: " + error)
            return error.message
        }
    }

    
module.exports = accModel