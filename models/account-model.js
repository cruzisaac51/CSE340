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
    accModel.infoUserAcount = async (account_email) =>{
        try {
            const datainfouser = await pool.query(
                "SELECT  *  FROM public.account WHERE account_email = $1",
                [account_email]
            )
            return datainfouser.rows
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


    
module.exports = accModel