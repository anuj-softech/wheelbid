import express from "express";
import cors from "cors";
import { expressConnectMiddleware } from "@connectrpc/connect-express";
import {dataRouter} from "./router/data";
import {test_database} from "./db/main";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Connect-Protocol-Version",
        "Connect-Timeout-Ms",
        "Authorization"
    ],
    exposedHeaders: ["Connect-Error-Code", "Connect-Error-Message"]
}));

app.use(expressConnectMiddleware({
    routes:dataRouter,
}));

app.all("/", (req, res) => {
    res.redirect( process.env.CORS_ORIGIN??"/");
});

app.get("/test_db", (req, res) => {
    test_database().then(r => {
        res.send("database status" + r);
    });
})


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`-----------------------------------------------`);
});