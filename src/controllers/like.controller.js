import mongoose, { isValidObjectId }  from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/apiResponse";
import { Like } from "../models/like.model";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    if (!videoId){
        throw new ApiError(400, "Video Id is required");
    }

    const likedAlready = await Like.findOne({
        video : videoId,
        owner : req.user?._id
    })
    if (likedAlready){
        await Like.findByIdAndDelete(likedAlready._id);

        return res.status(200)
                  .json(new ApiResponse(200, { isLiked : false}))
    }

    await Like.create({
        video : videoId,
        likedBy : req.user?._id
    })
    return res.status(200)
              .json(new ApiResponse(200, { isLiked : true}));
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    if (! isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid Tweet Id");
    }

    const likedAlready = await Like.findOne({
        tweet : tweetId,
        likedBy : req.user?._id
    })

    if (likedAlready){
        await Like.findByIdAndDelete(likedAlready._id);

        return res.status(200)
                  .json(new ApiResponse(200, { tweetId, isLiked : false}))
    }

    await Like.create({
        tweet : tweetId,
        likedBy : req.user?._id
    })

    return res.status(200)
              .json(new ApiResponse(200, { tweetId, isLiked : true}))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    if (! isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment Id");
    }

    const likedAlready = await Like.findOne({
        comment : commentId,
        likedBy : req.user?._id
    })

    if (likedAlready){
        await Like.findByIdAndDelete(likedAlready._id);

        return res.status(200)
                  .json(new ApiResponse(200, { isLiked : false}))
    }

    await Like.create({
        comment : commentId,
        likedBy : req.user?._id
    })

    return res.status(200)
              .json(new ApiResponse(200, { isLiked : true}))
})

export {
    toggleVideoLike,
    toggleTweetLike,
    toggleCommentLike
}