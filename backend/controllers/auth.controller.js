import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js"; // Make sure to import User and bcrypt
import bcrypt from "bcryptjs"; // Ensure bcrypt is imported

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        console.log("Received email:", email); // Debug log

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invali format" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashPassword,
        });

        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
        });
    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const login = async (req,res)=>{
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);
    
        // Return the user data if login is successful
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    
};

export const logout = async (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message: "Logged out successfully"})
    } catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};


export const getMe = async (req, res)=>{
    try{
       const user = await User.findById(req.user._id).select("-password");
       res.status(200).json(user);
    }
    catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}
