const { ObjectId } = require('mongoose').Types;
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    // {
    //     userId: {
    //         type: Schema.Types.ObjectId,
    //         default: () => new Types.ObjectId()
    //     }
    // },
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        },

        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            }
        ],

        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        toObject: {
            virtuals: true,
            getters: true
        }
    }
);

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('user', userSchema);
module.exports = User;