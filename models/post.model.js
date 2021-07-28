const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autopopulate = require('mongoose-autopopulate');

var schemaOptions = {
    toCourseObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: 'create_date', updatedAt: 'last_updated' }
};

var PostSchema = new Schema({
    post: { type: String, default: " " },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    topic_id: { type: Schema.Types.ObjectId, ref: 'Topic',autopopulate: true },
    comment_post: { type: Array, default: [] },
    post_images: { type: Array, default: [] }
}, schemaOptions);

PostSchema.plugin(autopopulate);
PostSchema.pre('save', function (next) { this.last_updated = new Date(); if (!this.isNew) { return next(); } next(); });

module.exports = mongoose.model('Post', PostSchema);