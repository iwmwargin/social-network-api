const router = require("express").Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    newFriend,
    removeFriend
} = require("../../controllers/user-controller");


router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

router.route("/:userId/friends/:friendId").post(newFriend).delete(removeFriend);

router.route("/").get(getAllUsers).post(createUser);

module.exports = router;