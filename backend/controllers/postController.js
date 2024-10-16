import Post from "../models/postModel.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";
import Notification from "../models/notificationModel.js";

export const createPost = async (req, res)=>{
    try{
        const {text}= req.body;
        let {img}=  req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId)
        if(!user) return res.status(400).json({message : "user not found"})

        if(!text && !img){
            return res.status(400).json({error : " post must have text or image"});
        }

        if(img){
            const uploadedResponse= await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })
        await newPost.save();

        res.status(201).json(newPost);

    } catch(error){
        res.status(400).json({error : " internal server error"});
    }
}

export const deletePost = async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({error : "post not found"});
        }

        if(post.user.toString() !== req.user._id.toString()){
            return  res.status(401).json({error : "your are not authorized"});
        }

        if(post.img){
            const imgId= post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({mesage :"post deleted successfully"});
    }
    catch(error){
        res.status(500).json({error : "error in internal server "});
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id; // Extract from authenticated user

        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }

        // Find the post by ID
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Add the comment
        const comment = { user: userId, text };
        post.comments.push(comment);

        // Save the post with the new comment
        await post.save();

        res.status(201).json({ message: "Comment added successfully", post });
    } catch (error) {
        console.error("Error in commentOnPost:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const likeUnLikePost = async (req,res)=>{
    try{
        const userId = req.user._id;
        const { id: postId} = req.params;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({error : " post not found"});
        }

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            await Post.updateOne({_id:postId}, {$pull : {likes : userId}})
            await User.updateOne({ _id: userId}, { $pull : {likedPosts : postId}});

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        }
        else{
            post.likes.push(userId);
            await User.updateOne({ _id: userId}, { $push : {likedPosts : postId}});
            await post.save();
            
            const notification = new Notification({
                from : userId,
                to : post.user,
                type : "like",
            });

            await notification.save();

            const updatedLikes =post.likes;

            res.status(200).json(updatedLikes);
        }
    }
    catch(error){
        console.log("Error in likeUnLikePost : ", error);
        res.status(500).json({error : " error in internal server"});
    }
}

export const getAllPost = async (req,res)=>{
    try{
        const posts=await Post.find().sort({createdAt: -1}).populate({
            path : "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password",
        });

        if(posts.length===0){
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    }catch(error){
        console.log("Error in getAllPost : ", error);
        res.status(500).json({error : "error in internal sever"});
    }
}

export const getLikedPosts = async (req,res)=>{
    const userId= req.params.id;
    try{
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error : "user not found"});

        const likedPosts = await Post.find({ _id : {$in : user.likedPosts}})
        .populate({
            path: "user",
            select : "-password",
        })
        .populate({
            path: "comments.user",
            select : "-password",
        })

        res.status(200).json(likedPosts);
    }
    catch(error){
        console.log("error in getlikedposts  : ", error);
        res.status(500).json({error : "internal error"});
    }
}

export const getFollowingPosts = async (req,res)=>{
    try{
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(! user) return res.status(404).json({error : "user not fount"});

        const following = user.following;
        const feedPosts = await Post.find({user : { $in : following}})
            .sort({createdAt : -1})
            .populate({
                path : "user",
                select : "-password"
            })
            .populate({
                path : "comments.user",
                select : "-password"
            });

            res.status(200).json(feedPosts);

    }
    catch(errror){
        console.log("error in getfollowing controlls", error);
        res.status(500).json({error : "internal server error"});
    }
}

export const getUserPosts = async (req, res)=>{s
    try{
        const {username} = req.params;

        const user = await User.findOne({username});

        if(!user) return res.status(404).json({error : "user not found"});

        const posts = await Post.find ({user : user._id}).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path : "user",
            select : "-password",
        })

        res.status(200).json(posts);

    }
    catch(error){
        console.log("error in getuserpost : ", error);
        res.status(500).json({error : "internal server error"});
    }
}