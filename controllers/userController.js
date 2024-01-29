const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// const friendCount = async () => {
//     const friends = await User.friends.aggregate().count('friendCount');
//     return friends;
// }

// const thoughtCount = async () => {
//     const thoughts = await User.thoughts.aggregate().count('thoughtCount');
//     return thoughts;
// }

module.exports = {
    // Get all Users
    async getUsers(req, res) {
        try {
            const users = await User.find();

            // const userObj = {
            //     users
            // };
            res.json(users);
        } catch (err) {
            console.log(err, 'getallusers');
            return res.status(500).json(err);
        }
    },

    // Get individual User
    async getUser(req, res) {
        try {
            const user = await User.findOne(
                {
                    _id: req.params.userId
                }).select('-__v')
                .populate('thoughts', '-__v')
                .populate('friends', '-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user matching ID' });
            };

            res.json({
                user,
                // thoughts: await thoughtCount(),
                // friends: await friendCount()
            })
        } catch (err) {
            console.log(err, 'getoneuser');
            return res.status(500).json(err);
        }
    },

    // Create a User
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            console.log(err, 'createuser');
            return res.status(500).json(err);
        }
    },

    // Update a User
    async updateUser(req, res) {
        try {
            // Find the user
            const user = await User.findOneAndUpdate(
                {
                    _id: req.params.userId
                },
                {
                    $set: req.body
                },
                {
                    runValidators: true,
                    new: true
                }
            );
            // Check the user
            if (!user) {
                res.status(404).json({
                    message: "No user found to update."
                })
            }
            // Update the user
            res.json(user);

        } catch (err) {
            console.log(err, 'updateuser');
            return res.status(500).json(err);
        }
    },

    // Delete a User
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({
                _id: req.params.userId
            });

            if (!user) {
                res.status(404).json({
                    message: "No User to delete."
                })
            };

            const thought = await Thought.findOneAndUpdate(
                {
                    users: req.params.userId
                },
                {
                    $pull: { users: req.params.userId }
                },
                {
                    new: true
                }
            );

            if (!thought) {
                return res.status(404).json({
                    message: "User gone, but no thoughts."
                })
            };

            res.json({
                message: "User deleted...forever."
            });

        } catch (err) {
            console.log(err, 'deleteuser');
            return res.status(500).json(err);
        }
    }






}