const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autopopulate = require('mongoose-autopopulate');

var schemaOptions = {
    toCourseObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: 'create_date', updatedAt: 'last_updated' }
};

var TopicSchema = new Schema({
    topicName: { type: String, default: " " },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
}, schemaOptions);

TopicSchema.plugin(autopopulate);
TopicSchema.pre('save', function (next) { this.last_updated = new Date(); if (!this.isNew) { return next(); } next(); });

module.exports = mongoose.model('Topic', TopicSchema);