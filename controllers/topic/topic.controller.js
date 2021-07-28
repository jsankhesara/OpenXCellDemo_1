const Topic = require('../../models/topic.model');
const User = require('../../models/user.model');
var resHandlerService = require('../../services/resHandler.service');
var payloadChecker = require('payload-validator');
var expectedPayload = {
    "user_id": "",
    "topicName": ""
};

exports.createTopic =async function (req, res) {
    var result = payloadChecker.validator(req.body, expectedPayload, ["user_id", "topicName"], false);
    if (!result.success) {
        resHandlerService.handleError(res, result.response.errorMessage);
        return;
    }
    var this_user = await User.findOne({ _id: req.body.user_id });
    if (!this_user) {
        resHandlerService.handleError(res, "User not found !!");
        return;
    }
    let topic = new Topic({
        user_id: req.body.user_id,
        topicName: req.body.topicName
    });
    Topic.create(topic, function (err, topicData) {
        if (err) {
            resHandlerService.handleError(res, "Something went wrong while creating topic")
        } else {
            resHandlerService.handleResult(res, topicData, "Topic added successfully");
        }
    });
}

exports.getTopicList =async function (req, res) {
    const fetchTopic = await Topic.find({}).sort({ create_date: 1 }).skip(req.body.skip > 0 ? ( ( req.body.skip - 1 ) * req.body.limit ) : 0).limit(req.body.limit ? req.body.limit : 5);
    resHandlerService.handleResult(res, fetchTopic, "Topic list");
}