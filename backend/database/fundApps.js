const { sql, ConnectionPool } = require('mssql');

const { connectionString } = require('./config');


// admin reads all funding applications
async function readFundApps() {
    try {
        // Create a new connection pool
        await pool.connect();

        console.log("Reading rows from the fundersApps Table...");
        const resultSet = await pool.request().query(`SELECT F.*, U.name AS name
        FROM fundersApps AS F
        JOIN [User] AS U ON F.applicant_email = U.email
        WHERE F.evaluated = 0;`);

        // Close the connection pool
        await pool.close();

        return resultSet.recordset;
    } catch (err) {
        await pool.close();
        console.error(err.message);
        throw err; // Re-throw the error to handle it in the caller
    }
}

// apply to be a fund manager 
async function insertFundingApp(object) {
    const pool = new ConnectionPool(connectionString);
    try {
        // Create a new connection pool
        await pool.connect();

        console.log("Inserting data to fundersApps...");

        // Insert the row into the table
        const resultSet = await pool.request().query(`
        INSERT INTO fundersApps (applicant_email, justification)
        SELECT applicant_email, justification
        FROM (
            SELECT '${object.email}' AS applicant_email, '${object.justification}' AS justification
        ) AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM fundersApps
            WHERE applicant_email = '${object.email}'
              AND justification = '${object.justification}'
        ); 
        `);

        // Close the connection pool
        await pool.close();

        let returnObj = { message: "Failure" };

        if (resultSet.rowsAffected[0] == 1) {
            returnObj.message = "Success";
        }

        console.log(returnObj);
        return returnObj;
    } catch (err) {
        await pool.close();
        console.error(err.message);
        throw err; // Re-throw the error to handle it in the caller
    }
}

// admin evaluates funding applications 
// approve or reject new fund managers

// who u want to update ie email
// the verdict ie Approved or Rejected

async function updateFundingApp(object) {
    const pool = new ConnectionPool(connectionString);
    try {
        // Create a new connection pool
        await pool.connect();

        console.log("Updating fundersApps!!")

        console.log(object);

        // Update the row into the table
        const resultSet = await pool.request().query(`UPDATE [fundersApps] SET evaluated = 1 WHERE applicant_email = '${object.email}';`);


        // Close the connection pool
        
        let returnObj = { message: "Failure to Evaluate" };
        
        if (resultSet.rowsAffected[0] >0) {
            returnObj.message = "Successfully Evaluated and rejected";
            
            
            if (object.verdict == 'Approved'){
                const response = await pool.request().query(`
                UPDATE [User] SET user_type = 'Fund Manager' WHERE email = '${object.email}';`);

                if (response.rowsAffected[0] == 1) {
                    returnObj.message = "Successfully Evaluted and approved";
                } else {
                    returnObj.message = "Failed to update user type";
                }
            }


        }
        
        await pool.close();
        console.log(returnObj);
        return returnObj;
    } catch (err) {
        await pool.close();
        console.error(err.message);
        throw err; // Re-throw the error to handle it in the caller
    }
}



// insertUserData("fhddbsjkf", "d")
// updateUserData("fhddbdsdsjkf", "f")

module.exports = {
    insertFundingApp,
    readFundApps,
    updateFundingApp
};
