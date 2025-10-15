import { createError } from "../utils/createError.js";
import { User } from "../models/user.model.js";
import { generateAndSetCookie } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";


export const loginController = async (req, res, next) => {

    
    //username password
    const { username, password } = req.body;


    try {
        if (!username || !password) {
            throw createError("Invalid inputs", 400)
        }

        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            throw createError("Password not match", 409)
        }

        //generate Token 
        generateAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            usernam: user.username,
            profilePic: user.profilePic,
            message : "User login successfully"
        })



    } catch (error) {
        console.log("Login Server Error", error.message)
        next(error.statusCode ? error : createError("Internal Server Error", 500));
    }


}


export const signupController = async (req, res, next) => {
    //fullName, username, password, confirmPassword, gender 
    const { fullName, username, password, confirmPassword, gender } = req.body;

    try {
        if (!fullName || !username || !password | !confirmPassword || !gender) {
            throw createError("Invalid inputs", 400)
        }
        if (password !== confirmPassword) {
            throw createError("Password not match", 409)
        }
        const user = await User.findOne({ username });
        if (user) throw createError("User already exist", 400)

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password : hashedPassword,
            gender,
            profilePic : gender === "male" ? boyProfilePic : girlProfilePic
        })
        console.log(newUser)
        
        //generate token
        
        if(newUser){

            generateAndSetCookie(newUser._id, res)

            await newUser.save()

            res.status(200).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                username : newUser.username,
                profilePic: newUser.profilePic,
                message : "User created successfully"

            })
        }else {
			throw createError("Invalid user data",400)
		}

    } catch (error) {
        
       next(error.statusCode ? error : createError("Internal Server Error", 500));
    }

}

export const logoutController =  async(req, res, next) => {

   try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		next(error.statusCode ? error : createError("Internal Server Error", 500));
	}

}