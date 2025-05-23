import { token } from "morgan";
import { User } from "../models/user.model.js";
import { generateAndSetCookie } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";


export const loginController = async (req, res) => {
    //username password
    const { username, password } = req.body;


    try {
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid inputs" })
        }

        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Wrong Password or Username" })
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
        return res.status(500).json({ error: "Internal Server Error" })
    }


}


export const signupController = async (req, res) => {
    //fullName, username, password, confirmPassword, gender 
    const { fullName, username, password, confirmPassword, gender } = req.body;

    try {
        if (!fullName || !username || !password | !confirmPassword || !gender) {
            return res.status(400).json({ error: "Invalid inputs" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password is not match" })
        }
        const user = await User.findOne({ username });
        if (user) return res.status(400).json({ error: "User already exists" });

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
			res.status(400).json({ error: "Invalid user data" });
		}

    } catch (error) {
        console.log("Signup Server Error",error.message)
        return res.status(500).json({ error: "Internal Server Error" })
    }

}

export const logoutController =  async(req, res) => {

   try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}

}