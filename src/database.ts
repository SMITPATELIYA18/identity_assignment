import dotenv from "dotenv";
import {Pool} from 'pg';

dotenv.config();

const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};

// const connection: Pool = mysql.createPool(options);

const connection = new Pool(
    {
        connectionString: process.env.DBConfigLink,
        ssl: {
            rejectUnauthorized: false
        }
    }
);
//     {
//     user: process.env.POST_USER,
//     host: process.env.POST_HOSt,
//     database: process.env.POST_DATABASE,
//     password: process.env.POST_PASSWORD,
//     port: 5432,
// }

export default connection;