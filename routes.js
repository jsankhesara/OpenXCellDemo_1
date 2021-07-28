/**
 * Main application routes
 */

'use strict';

module.exports = function (app) {
    app.use('/api/user', require('./controllers/user'));
    app.use('/api/topic', require('./controllers/topic'));
    app.use('/api/post', require('./controllers/post'));
};