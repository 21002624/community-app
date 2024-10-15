import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { commentOnPost, createPost, deletePost, getAllPost, getFollowingPosts, getLikedPosts, getUserPosts, likeUnLikePost } from '../controllers/postController.js';

const router = express.Router();

router.post("/create",protectRoute,createPost);
router.delete("/:id",protectRoute,deletePost);
router.post("/comment/:id",protectRoute,commentOnPost);
router.post("/like/:id",protectRoute,likeUnLikePost);
router.get("/all",protectRoute,getAllPost);
router.get("/likes/:id",protectRoute,getLikedPosts);
router.get("/following",protectRoute,getFollowingPosts);
router.get("/user/:username",protectRoute,getUserPosts);

export default router;
