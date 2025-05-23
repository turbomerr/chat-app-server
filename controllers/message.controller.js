import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";


export const sendMessage = async(req, res) => {

    const {message} = req.body; // message that send to receiver
    const {id : receiverId} = req.params; // id that receiver id
    const senderId = req.user._id; // senderId that already logged in the website

    try {
        const conversation = await Conversation.findOne({
            participation : { $all : [senderId, receiverId]} // bir array alanının içinde verilen tüm değerlerin bulunup bulunmadığını kontrol eder.
        })
        //conversation => object
        //first time message
        if(!conversation){
            await Conversation.create({participation : [senderId, receiverId]})
        }
        //from req.body
        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }
        await conversation.save()
        await newMessage.save()

        res.status(201).json({newMessage})


    } catch (error) {
        
    }
} 