const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    // Get all Thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            console.log(err, 'getallthoughts');
            return res.status(500).json(err);
        }
    },

    // Get individual Thought
    async getThought(req, res) {
        try {
            const thought = await Thought.findOne(
                {
                    _id: req.params.thoughtId
                }).select('-__v')
                .populate('thoughts', '-__v')
                .populate('friends', '-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought matching ID' });
            };

            res.json({
                thought
            })
        } catch (err) {
            console.log(err, 'getonethought');
            return res.status(500).json(err);
        }
    },

    // Create a Thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            res.json(thought);
        } catch (err) {
            console.log(err, 'createthought');
            return res.status(500).json(err);
        }
    },

    // Update a Thought
    async updateThought(req, res) {
        try {
            // Find the thought
            const thought = await Thought.findOneAndUpdate(
                {
                    _id: req.params.thoughtId
                },
                {
                    $set: req.body
                },
                {
                    runValidators: true,
                    new: true
                }
            );
            // Check the thought
            if (!thought) {
                res.status(404).json({
                    message: "No thought found to update."
                })
            }
            // Update the thought
            res.json(thought);

        } catch (err) {
            console.log(err, 'updatethought');
            return res.status(500).json(err);
        }
    },

    // Delete a Thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({
                _id: req.params.thoughtId
            });

            if (!thought) {
                res.status(404).json({
                    message: "No Thought to delete."
                })
            };

            // const thought = await Thought.findOneAndUpdate(
            //     {
            //         thoughts: req.params.thoughtId
            //     },
            //     {
            //         $pull: { thoughts: req.params.thoughtId }
            //     },
            //     {
            //         new: true
            //     }
            // );

            // if (!thought) {
            //     return res.status(404).json({
            //         message: "Thought gone, but no users."
            //     })
            // };

            res.json({
                message: "Thought deleted...forever."
            });

        } catch (err) {
            console.log(err, 'deletethought');
            return res.status(500).json(err);
        }
    },

    // Create a reaction
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {
                    _id: req.params.thoughtId
                },
                {
                    $addToSet: { reactions: req.params.reactionId }
                },
                {
                    runValidators: true, new: true
                }
            );

            if (!thought) {
                return res.status(404).json({
                    message: "No Reaction/User with that ID."
                })
            }

            res.json(thought);

        } catch (err) {
            console.log(err, 'addreaction');
            return res.status(500).json(err);
        }
    },

    // Delete a reaction
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {
                    _id: req.params.thoughtId
                },
                {
                    $pull: {
                        reactions: {
                            reactionId: req.params.reactionId
                        }
                    }
                },
                {
                    runValidators: true, new: true
                }
            )

            if (!thought) {
                return res.status(404).json({
                    message: "No reaction to delete, sad."
                })
            }

            res.json(thought);

        } catch (err) {
            console.log(err, 'deletereaction');
            res.status(500).json(err);
        }
    }
}