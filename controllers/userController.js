const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    // Get all Users
    async getUsers(req, res) {
        try {
            const users = await User.find();
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
                user
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

        } catch (err) {
            console.log(err, 'deleteuser');
            return res.status(500).json(err);
        }
    },

    // Create a friend
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                {
                    _id: req.params.userId
                },
                {
                    $addToSet: { friends: req.params.friendId }
                },
                {
                    runValidators: true, new: true
                }
            );

            if (!user) {
                return res.status(404).json({
                    message: "No Friend/User with that ID."
                })
            }

            res.json(user);

        } catch (err) {
            console.log(err, 'addfriend');
            return res.status(500).json(err);
        }
    },

    // Delete a friend
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                {
                    _id: req.params.userId
                },
                {
                    $pull: { friends: req.params.friendId }
                },
                {
                    runValidators: true, new: true
                }
            )

            if (!user) {
                return res.status(404).json({
                    message: "No friend to delete, sad."
                })
            }

            res.json(user);

        } catch (err) {
            console.log(err, 'deletefriend');
            res.status(500).json(err);
        }
    }
}