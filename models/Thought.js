const { Schema, Types } = require('mongoose');
const dayjs = require('dayjs');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        }
    },
    {
        createdAt: {
            type: Date,
            default: Date.now,
            get: format(function (date) {
                dayjs(date).format("MM/DD/YY @ hh:mm")
            })
        }
    },
    {
        userName: {
            type: String,
            required: true,
            ref: 'user'
        }
    },
    {
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        }
    }
);

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);
module.exports = Thought;