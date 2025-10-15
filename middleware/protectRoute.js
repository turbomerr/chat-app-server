import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { User } from "../models/user.model.js";
import { createError } from "../utils/createError.js";

dotenv.config({ path: '../.env' })

export const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;

        if (!token) return createError("Unauthorized - No Token Provided", 401)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded :
            // {
            // userId: "abc123",
            // iat: 1716487200,     // start time (timestamp)
            // exp: 1716490800      // end time (timestamp)
            // }
        if (!decoded) throw createError("Unauthorized - Invalid Token", 401)

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) throw createError("User not found", 404)

        req.user = user;
        console.log("Decoded User : ",req.user);
        next()
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        throw createError("Internal server error", 500)
    }


}