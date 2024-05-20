require('dotenv').config();

const {sql , ConnectionPool } = require('mssql');
const { connectionString } = require('./config');

const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = 'ezeziblobstorage'; // replace with your container name

async function readapplicationsForFundingOpps (email) {
    const pool = new ConnectionPool(connectionString);
    try {
        // Create a new connection pool
        await pool.connect();

        console.log("Reading rows from the applicationsForFundingOpps Table...");
        const resultSet = await pool.request().query(`
        SELECT A.*, U.name
        FROM applicationsForFundingOpps A
        JOIN funding_opportunities F ON A.fundingOpp_ID = F.id
        JOIN [User] U ON A.applicant_email = U.email
        WHERE F.fund_manager_email = '${email}';
        
        `);

        // Close the connection pool
        await pool.close();

        return resultSet.recordset;
    } catch (err) {
        await pool.close();
        console.error(err.message);
        throw err; // Re-throw the error to handle it in the caller
    }
}

async function insertApplicationsForFundingOpps(object) {
    const pool = new ConnectionPool(connectionString);
    try {
        // Create a new connection pool
        await pool.connect();

        console.log("Inserting data into applicationsForFundingOpps...");

        // Insert the row into the table
        const resultSet = await pool.request().query(`
        INSERT INTO applicationsForFundingOpps (applicant_email, fundingOpp_ID, applicant_motivation, applicant_documents)
SELECT '${object.applicant_email}', ${object.fundingOpp_ID}, '${object.applicant_motivation}', '${object.applicant_documents}'
WHERE NOT EXISTS (
    SELECT 1
    FROM applicationsForFundingOpps
    WHERE applicant_email = '${object.applicant_email}' AND fundingOpp_ID = ${object.fundingOpp_ID}
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

async function updateApplicationsForFundingOpps(object) {
    const pool = new ConnectionPool(connectionString);
    try {
        // Create a new connection pool
        await pool.connect();

        console.log("Updating data in applicationsForFundingOpps...");

        // Insert the row into the table
        const resultSet = await pool.request().query(`
        UPDATE applicationsForFundingOpps
        SET status = '${object.status}'
        WHERE id = ${object.id};
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

async function UploadToBlobStorage(object) {
    if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw new Error('Azure Storage connection string is missing.');
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const createContainerResponse = await containerClient.createIfNotExists();
    console.log(`Create container ${CONTAINER_NAME} successfully`, createContainerResponse.succeeded);

    const blobName = `${uuidv4()}.json`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const content = JSON.stringify(object);
    const uploadBlobResponse = await blockBlobClient.upload(content, Buffer.byteLength(content));
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);

    const blobUrl = blockBlobClient.url;
    return blobUrl;
}

// insertUserData("fhddbsjkf", "d")
// updateUserData("fhddbdsdsjkf", "f")

module.exports = {
    insertApplicationsForFundingOpps,
    readapplicationsForFundingOpps,
    updateApplicationsForFundingOpps,
    UploadToBlobStorage
};
