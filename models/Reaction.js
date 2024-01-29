const { Schema, Types } = require('mongoose');
const dayjs = require('dayjs');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },

        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },

        userName: {
            type: String,
            required: true,
            ref: 'user'
        },

        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => {
                dayjs(date).format("MM/DD/YY @ hh:mm")
            }
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
)

module.exports = reactionSchema;