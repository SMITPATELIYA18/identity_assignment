import express from "express";
import dotenv from "dotenv";
import connection from "./database";
import Router from "./Router";
import cron from "node-cron";
import * as https from "node:https";

const app: express.Express = express();
dotenv.config();

const PORT: string | number = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", Router);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to Database:\n ' + err.stack);
        return;
    }
    console.log('Connected to Postgres');

    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
        cron.schedule('*/60 * * * *', async () => {
            try {
                // Make an HTTP request to your endpoint
                https.get('https://identity-assignment.onrender.com/_testing', response => {
                    console.log('HTTP request successful:', response);
                });
            } catch (error) {
                console.error('Error making HTTP request:', error);
            }
        });
    });
});