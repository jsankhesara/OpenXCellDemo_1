const User = require('../../models/user.model');
var resHandlerService = require('../../services/resHandler.service');
var common = require('../../utils/common');
var auth = require('../../auth/auth.service');
var emailer = require('../../utils/email');
var payloadChecker = require('payload-validator');
var expectedPayload = {
    "email": "",
    "password": ""
};

exports.register = function (req, res) {
    var result = payloadChecker.validator(req.body, expectedPayload, ["email", "password"], false);
    if (!result.success) {
        resHandlerService.handleError(res, result.response.errorMessage);
        return;
    }
    User.findOne({ email: req.body.email }, function (err, usr) {
        if (err) {
            resHandlerService.handleError(res, "Something went wrong")
        } else {
            if (usr) {
                resHandlerService.handleError(res, "Email already exists");
            } else {
                const saltPassword = common.makeSalt();
                const encryptedPassword = common.encryptPassword(req.body.password, saltPassword);
                const regObj = {
                    "email": req.body.email,
                    "password": encryptedPassword,
                    "saltPassword": saltPassword
                }
                var data = new User(regObj);
                User.create(data, function (err, user) {
                    if (err) {
                        resHandlerService.handleError(res, "Something went wrong while creating user")
                    } else {
                        emailer("Welcome Email", "Welcome to OpenXCell", req.body.email);
                        resHandlerService.handleResult(res, user, "Registered successfully.");
                    }
                });
            }
        }
    })
}

exports.login = async function (req, res) {
    var result = payloadChecker.validator(req.body, expectedPayload, ["email", "password"], false);
    if (!result.success) {
        resHandlerService.handleError(res, result.response.errorMessage);
        return;
    }
    User.findOne({ email: req.body.email }, async function (err, user) {
        if (!user) {
            resHandlerService.handleError(res, "email or password is wrong");
        } else {
            let hashedPassword = common.encryptPassword(req.body.password, user.saltPassword);
            if (hashedPassword == user.password) {
                const token = auth.signToken(user._id);
                let userObj = JSON.parse(JSON.stringify(user));
                if (!userObj.hasOwnProperty('token')) {
                    userObj.token = token;
                }
                let query = { authToken: token };
                await User.updateOne({ _id: user._id }, query).exec();
                resHandlerService.handleResult(res, userObj);
            } else {
                resHandlerService.handleError(res, "email or password is wrong");
            }
        }
    })
}