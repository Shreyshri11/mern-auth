import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3000;
mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.error(error.message);
    });

const app = express();

app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port} `);
});
