const { Thought, User } = require("../models");

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .select("-__v")
        .sort({ _id: -1 })
        .then(thoughtData => res.json(thoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    getThoughtsById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .select("-__v")
        .then(thoughtData => {
            if(!thoughtData) {
                res.status(404).json({ message: "No thought found with this ID!"});
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    addThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: _id } },
                { new: true } 
            );
        })
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: "No user found with this ID!" });
                return;
            }
            res.json(userData);
        })
        .catch(err => res.json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new:true, runValidators: true})
        .then(thoughtData => {
            if(!thoughtData) {
                res.status(404).json({ message: "No thought found with this ID!"});
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => res.status(400).json(err));
    },
    
    
    removeThought({ params }, res) {
        Thought.findOneAndDelete(
            { _id: params.thoughtId })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: "No thought found with this ID!"});
                }
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $pull: { thoughts: params.thoughtId} },
                    { new: true }
                );
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: "No user found with this ID!" });
                    return;
                }
                res.json((userData));
            })
            .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(thoughtData => {
            if (!thoughtData) {
                return res.status(404).json({ message: "No thought found with this ID!"});
            }
            res.json(thoughtData);
        })
        .catch(err => res.json(err));
    },

    removeReaction({ params }, res) {
        console.log(params.thoughtId, params.reactionId);
        Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { runValidators: true, new: true }
        )
        .then(userData => res.json(userData))
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;