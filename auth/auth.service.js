var config = require('../utils/config');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var responseHandler = require('../services/resHandler.service');
var User = require('../models/user.model');
var validateJwt = expressJwt({ secret: config.secrets.session, algorithms: ['sha1', 'RS256', 'HS256'], });

function isAuthenticated() {
    return compose()
        .use(function (req, res, next) {
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = 'Bearer ' + req.query.access_token;
            }
            validateJwt(req, res, next);
        })
        .use(function (req, res, next) {
            User.findById(req.user._id, function (err, user) {
                if (err)
                    return next(err);
                if (!user) {
                    responseHandler.handleError(res, 'Unauthorized');
                    return;
                }
                req.user = user;
                next();
            });
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
    return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: 60 * 43800 }); // 1 month
}


exports.isAuthenticated = isAuthenticated;
exports.signToken = signToken;
