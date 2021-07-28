'use strict';

const express = require('express');
const controller = require('../post/post.controller');
var auth = require('../../auth/auth.service');
const { upload } = require('../../utils/multer');

const router = express.Router();

router.post('/createPost', auth.isAuthenticated(),upload.array('files'),controller.createPost);
router.post('/commentPost', auth.isAuthenticated(),controller.commentPost);
router.post('/getPostList', auth.isAuthenticated(),controller.getPostList);

module.exports = router;