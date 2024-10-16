import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import {v2 as cloudinary} from "cloudinary";
import postRoutes from "./routes/postRoutes.js";
import notificationRoute from "./routes/notificationRoutes.js"

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app=express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
 
// console.log(process.env.MONGO_URI);

// app.get("/",(req,res)=>{
//     res.send("server is ready");
// })

app.use("/api/auth",authRoutes); // middleware to pareser to body
app.use("/api/users",userRoutes);
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoute)


app.listen(PORT,()=>{
    console.log(`server is listining on port : ${PORT}`);
    connectMongoDB();
}) ;