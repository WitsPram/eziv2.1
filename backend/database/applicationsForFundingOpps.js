const {sql , ConnectionPool } = require('mssql');

const { connectionString } = require('./config');

const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');



const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=ezeziblobstorage;AccountKey=v6RC6oOP+Ug0YZ7o0nzUfi6XKo1qYol/Cl8fkXvYotxo83JTSSmbyOXyvJWwXBJW1Cyhmuc1y/s6+AStOsHNQw==;EndpointSuffix=core.windows.net";
const CONTAINER_NAME = 'ezeziblobstorage'; // replace with your container name

async function readapplicationsForFundingOpps (email) {
    try {
        // Create a new connection pool
        const pool = new ConnectionPool(connectionString);
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
        console.error(err.message);
        throw err; // Re-throw the error to handle it in the caller
    }
}

async function insertApplicationsForFundingOpps(object) {
    try {
        // Create a new connection pool
        const pool = new ConnectionPool(connectionString);
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
        console.error(err.message);
        throw err; // Re-throw the error to handle it in the caller
    }
}

async function updateApplicationsForFundingOpps(object) {
    try {
        // Create a new connection pool
        const pool = new ConnectionPool(connectionString);
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

    const blobName = `${uuidv4()}.pdf`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadBlobResponse = await blockBlobClient.uploadFile(object.path);

    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);

    const blobUrl = blockBlobClient.url;
    console.log(`Blob Url: ${blobUrl}`);
    return blobUrl;
}


// insertUserData("fhddbsjkf", "d")
// updateUserData("fhddbdsdsjkf", "f")

module.exports = {
    insertApplicationsForFundingOpps,
    readapplicationsForFundingOpps,
    UploadToBlobStorage,
    updateApplicationsForFundingOpps
};
