require('dotenv').config();

const {sql , ConnectionPool } = require('mssql');
const { connectionString } = require('./config');

const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');



const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=ezeziblobstorage;AccountKey=v6RC6oOP+Ug0YZ7o0nzUfi6XKo1qYol/Cl8fkXvYotxo83JTSSmbyOXyvJWwXBJW1Cyhmuc1y/s6+AStOsHNQw==;EndpointSuffix=core.windows.net";
const CONTAINER_NAME = 'ezeziblobstorage'; // replace with your container name

async function readapplicationsForFundingOpps (fk_tenant_id) {
    const pool = new ConnectionPool(connectionString);
    try {
        // Create a new connection pool
        await pool.connect();

        console.log("Reading rows from the applicationsForFundingOpps Table...");
        const resultSet = await pool.request().query(`
        SELECT A.*, U.username
        FROM applicationsForFundingOpps A
        JOIN funding_opportunities F ON A.fundingOpp_ID = F.id
        JOIN [User] U ON A.fk_tenant_id = U.tenant_id
        WHERE F.fk_tenant_id = '${fk_tenant_id}';
        
        `);

        // Close the connection pool
        await pool.close();

        console.log(resultSet.recordset);   

        let returnObj = { message: "Failure" };

        if (resultSet.recordset.length !== 0) {
            returnObj.applications = resultSet.recordset;
            returnObj.message = "Success";
        }

        return returnObj;
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

        console.log(object);

        // Insert the row into the table
        const resultSet = await pool.request().query(`
        INSERT INTO applicationsForFundingOpps (fk_tenant_id, fundingOpp_ID, applicant_motivation, applicant_documents, created_at, status)
        SELECT * FROM (SELECT '${object.fk_tenant_id}' AS fk_tenant_id, 
                              '${object.fundingOpp_ID}' AS fundingOpp_ID, 
                              '${object.applicant_motivation}' AS applicant_motivation, 
                              '${object.applicant_documents}' AS applicant_documents, GETDATE() AS created_at, 
                              'Pending' AS status) AS tmp
        WHERE NOT EXISTS (
            SELECT 1 FROM applicationsForFundingOpps WHERE fk_tenant_id = tmp.fk_tenant_id
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
        SET status = '${object.verdict}', created_at = GETDATE()
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
