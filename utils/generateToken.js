import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config({ path: '../.env' })

export const generateAndSetCookie = (id, res) => {
    const token = jwt.sign({userId : id}, process.env.JWT_SECRET, {
        expiresIn : "1h"
    })

    res.cookie("jwt", token, {
        maxAge : 1 * 60 * 60 * 1000, //ms
        httpOnly : true,
        sameSite : true
    })
}
