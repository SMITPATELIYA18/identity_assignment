import express from "express";
import dotenv from "dotenv";

const app: express.Express = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/identity",  (req: express.Request, res: express.Response) => {
    console.log(req.body);
    return res.status(200).json(req.body);
})

const PORT:string | number = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});