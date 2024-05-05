const {sql , ConnectionPool } = require('mssql');
const connectionString = `Server=tcp:ezezimalidbs.database.windows.net,1433;Initial Catalog=ezezimalidb;Persist Security Info=False;User ID=ezezimali_admin;Password=Ezimal11;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`;

async function getFunders() {
    try {
        // Create a new connection pool
        const pool = new ConnectionPool(connectionString);
        await pool.connect();

        console.log("Reading rows from the Table...");
        const resultSet = await pool.request().query(`select * from funders`);

        let funders = [];
        resultSet.recordset.forEach(row => {
            funders.push(row);
        });

        // Close the connection pool
        await pool.close();

        return funders;
    } catch (err) {
        console.error(err.message);
        throw err; // Re-throw the error to handle it in the caller
    }
}

module.exports = { getFunders };