const Post = require('../../models/post.model');
const Topic = require('../../models/topic.model');
var resHandlerService = require('../../services/resHandler.service');
var mongoose = require("mongoose");
var config = require('../../utils/config');
var payloadChecker = require('payload-validator');
var expectedPayload = {
    "user_id": "",
    "topic_id": "",
    "post": "",
    "comment": ""
};

exports.createPost = async function (req, res) {
    var result = payloadChecker.validator(req.body, expectedPayload, ["user_id", "topic_id", "post"], false);
    if (!result.success) {
        resHandlerService.handleError(res, result.response.errorMessage);
        return;
    }
    var this_topic = await Topic.findOne({ _id: req.body.topic_id });
    if (!this_topic) {
        resHandlerService.handleError(res, "Topic not found !!");
        return;
    }
    let post = new Post({
        user_id: req.body.user_id,
        topic_id: req.body.topic_id,
        post: req.body.post
    });
    Post.create(post, async function (err, postData) {
        if (err) {
            resHandlerService.handleError(res, "Something went wrong while creating post");
        } else {
            if (req.files) {
                let query = { _id: postData._id };
                req.files.forEach(async function (f) {
                    let imageObj = {
                        imageName: f.filename
                    }
                    const updateCommentData = { $push: { "post_images": imageObj } }
                    await Post.updateOne(query, updateCommentData).exec();
                })
            }
            resHandlerService.handleResult(res, postData, "Post added successfully");
        }
    });
}

exports.commentPost = async function (req, res) {
    var result = payloadChecker.validator(req.body, expectedPayload, ["user_id", "post_id", "comment"], false);
    if (!result.success) {
        resHandlerService.handleError(res, result.response.errorMessage);
        return;
    }
    var this_post = await Post.findOne({ _id: req.body.post_id });
    if (!this_post) {
        resHandlerService.handleError(res, "Post not found !!");
        return;
    }
    let query = { _id: req.body.post_id };
    let commentObj = {
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        post_id: mongoose.Types.ObjectId(req.body.post_id),
        comment: req.body.comment
    }
    const updatePostImageData = { $push: { "comment_post": commentObj } };
    Post.updateOne(query, updatePostImageData, function (err, data) {
        if (err) {
            resHandlerService.handleError(res, "Something went wrong while adding comment");
        } else {
            resHandlerService.handleResult(res, "", "Comment added successfully");
        }
    });
}

exports.getPostList = async function (req, res) {
    const fetchpost = await Post.find({}).sort({ create_date: 1 }).skip(req.body.skip > 0 ? ((req.body.skip - 1) * req.body.limit) : 0).limit(req.body.limit ? req.body.limit : 5);
    const finalArray = [];
    fetchpost.map((element) => {
        if (element.post_images.length > 0) {
            element.post_images.map((ele) => {
                if (ele.imageName) {
                    ele.imageName = config.server_path + config.defaultImageUploadPath + "/" + ele.imageName
                }
                finalArray.push(element);
            })
        } else {
            finalArray.push(element);
        }
    })
    resHandlerService.handleResult(res, finalArray, "Post list");
}