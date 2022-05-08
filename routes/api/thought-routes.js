const router = require("express").Router();

const {
    getAllThoughts,
    getThoughtsById,
    addThought,
    updateThought,
    removeThought,
    addReaction,
    removeReaction
} = require("../../controllers/thought-controller");


router.route("/").get(getAllThoughts);

router.route("/:userId").post(addThought);

router.route("/:id").get(getThoughtsById).put(updateThought);

router.route("/:userId/:thoughtId").delete(removeThought);

router.route("/:thoughtId/reactions").post(addReaction);

router.route("/:thoughtId/reactions/reactionId").delete(removeReaction);

module.exports = router;