import express from "express";
import cors from "cors";
import { expressConnectMiddleware } from "@connectrpc/connect-express";
import {dataRouter} from "./router/data";
import {test_database} from "./db/test";

const app = express();

app.use(cors({
    origin: "http://localhost:5174", // Your SvelteKit dev port
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

app.get("/", (req, res) => {
    res.send("WheelBid RPC Server is running.");
});

app.get("/test_database", (req, res) => {
    test_database().then(r => {
        console.log("test_database", r);
    });
    res.send("database server is running.");
})


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`🚗 Service: wheelbid.v1.CarService`);
    console.log(`-----------------------------------------------`);
});