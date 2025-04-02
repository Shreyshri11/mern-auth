import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";
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

const __dirname = path.resolve(); // this is going to find dynamic directory name

const app = express();

//middleware

app.use(express.static(path.join(__dirname, "/client/dist"))); // this is going to serve the static files from the build folder

app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
} ) ;// this is going to serve the index.html file from the build folder

app.use(express.json());

app.use(cookieParser());

app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port} `);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500 ; //500 is internal server error
    const message = err.message || 'Internal server Error' ;
    return res.status(statusCode).json({ 
        success: false,
        message,
        statusCode,
    }) ;
});
