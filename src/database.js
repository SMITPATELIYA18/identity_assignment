"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};
// const connection: Pool = mysql.createPool(options);
const connection = new pg_1.Pool({
    connectionString: process.env.DBConfigLink,
    ssl: {
        rejectUnauthorized: false
    }
});
//     {
//     user: process.env.POST_USER,
//     host: process.env.POST_HOSt,
//     database: process.env.POST_DATABASE,
//     password: process.env.POST_PASSWORD,
//     port: 5432,
// }
exports.default = connection;
