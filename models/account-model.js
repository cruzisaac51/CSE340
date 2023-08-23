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
            //console.log("queryinfouser",datainfouser)
                return datainfouser
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

    /* *****************************
    *   Add new message
    * *************************** */
    accModel.newMessage= async(message_to, message_subject, message_body, message_from) =>{
        try {
            const sql = "INSERT INTO message (message_subject, message_body, message_to, message_from) VALUES ($1, $2, $3, $4) RETURNING *"
            return await pool.query(sql, [message_subject, message_body, message_to, message_from])
        } catch (error) {
            return error.message
        }
    }
    
    /* *****************************
    * Return messages not read using messages_to
    * ***************************** */
    accModel.getUnreadMessages =async (message_to) => {
        try {
        const result = await pool.query(
            'SELECT message_id, message_subject, message_body, message_created, message_to, message_from, message_read, message_archived FROM message WHERE message_to = $1 AND message_read = false',
            [message_to])
        return result.rows
        } catch (error) {
        return new Error("No message found")
        }
    }
    
    /* *****************************
    * Return messageusing messages_id
    * ***************************** */
    accModel.getMessage = async (message_id) => {
        try {
        const result = await pool.query(
            'SELECT message_id, message_subject, message_body, message_created, message_to, message_from, message_read, message_archived FROM message WHERE message_id = $1',
            [message_id])
        return result.rows[0]
        } catch (error) {
        return new Error("No message found")
        }
    }
    /* *****************************
    *   Update message as read
    * *************************** */
    accModel.updateMessageRead = async (message_id) =>{
        try {
            const sql = "UPDATE public.message SET message_read = true WHERE message_id = $1 RETURNING *"
            const data = await pool.query(sql, [message_id])
            return data.rows[0]
        } catch (error) {
        console.error("Update Error")
        }
    }
    /* *****************************
    *   Update message as archived
    * *************************** */
    accModel.updateMessageArchive = async(message_id) =>{
        try {
            const sql = "UPDATE public.message SET message_archived = true WHERE message_id = $1 RETURNING *"
            const data = await pool.query(sql, [message_id])
            return data.rows[0]
        } catch (error) {
        console.error("Update Error")
        }
    }
    /* *****************************
    *   Delete message
    * *************************** */
    accModel.deleteMessage = async (message_id) =>{
        try {
            const sql = "DELETE FROM public.message WHERE message_id = $1"
            await pool.query(sql, [message_id])
        } catch (error) {
        console.error("Error Deleting Message")
        }
    }
    /* *****************************
    * Return archived messages using messages_to
    * ***************************** */
    accModel.getArchivedMessages = async (message_to) => {
        try {
        const result = await pool.query(
            'SELECT m.*, a.account_firstname AS message_from_firstname, a.account_lastname AS message_from_lastname FROM public.message m LEFT JOIN public.account a ON m.message_from = a.account_id WHERE m.message_to IN ($1) AND m.message_archived = true ORDER BY m.message_created desc',
            [message_to])
        return result.rows
        } catch (error) {
        return new Error("No message found")
        }
    }
    
    /* *****************************
    * Return messages and sender name using messages_to
    * ***************************** */
    accModel.getMessagesAndName = async (message_to) => {
        try {
        const result = await pool.query(
            'SELECT m.*, a.account_firstname AS message_from_firstname, a.account_lastname AS message_from_lastname FROM public.message m LEFT JOIN public.account a ON m.message_from = a.account_id WHERE m.message_to IN ($1) AND m.message_archived = false ORDER BY m.message_created desc',
            [message_to])
        return result.rows
        } catch (error) {
        return new Error("No matching email found")
        }
    }
  
    
module.exports = accModel