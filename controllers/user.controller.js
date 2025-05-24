import { User } from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {

    try {
        const loggedUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password");

        res.status(201).json({ filteredUsers })
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}