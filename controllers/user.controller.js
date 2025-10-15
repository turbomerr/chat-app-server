import { User } from "../models/user.model.js";
import { createError } from "../utils/createError.js";

export const getUsersForSidebar = async (req, res, next) => {

    try {
        const loggedUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password");

        res.status(201).json({ filteredUsers })
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        next(error.statusCode ? error : createError("Internal Server Error", 500));
    }
}