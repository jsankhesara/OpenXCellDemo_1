'use strict';

const express = require('express');
const controller = require('../topic/topic.controller');
var auth = require('../../auth/auth.service');

const router = express.Router();

router.post('/createTopic',auth.isAuthenticated(),controller.createTopic);
router.post('/getTopicList',auth.isAuthenticated(), controller.getTopicList);

module.exports = router;