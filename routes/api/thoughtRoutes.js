const router = require('express').Router();
const {
    getThoughts,
    getThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thoughtController');

// api/thoughts
router.route('/')
    .get(getThoughts)
    .post(createThought);

// api/thoughts/:thoughtId
router.route('/:thoughtId')
    .get(getThought)
    .delete(deleteThought)
    .put(updateThought);

// api/thoughts/:thoughtId/reactions
// router.route('/:ThoughtId/thoughts').post(addReaction);

// api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId')
    .post(addReaction)
    .delete(deleteReaction);

module.exports = router;