import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";



export const sendMessage = async(req, res) => {

    const {message} = req.body; // message that send to receiver
    const {id : receiverId} = req.params; // id that receiver id
    const senderId = req.user._id; // senderId that already logged in the website

    try {
        let conversation = await Conversation.findOne({
            participation : { $all : [senderId, receiverId]} // bir array alanının içinde verilen tüm değerlerin bulunup bulunmadığını kontrol eder.
        })
        //conversation => object
        //first time message
        if(!conversation){
            conversation = await Conversation.create({participation : [senderId, receiverId]})
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
        
        // this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json({newMessage})


    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
} 

export const getMessage = async(req, res) => {
    const {id : userToChatId} = req.params;
    const senderId = req.user._id; //senderId come form protect route

    try {
        const conversation = await Conversation.findOne({
            participation : { $all : [senderId, userToChatId]}
        }).populate("messages");// all messages get that between sender and receiver
        //messages ayri semadaysa conversation messagesle beraber geir
        //console.log("Conversation : ",conversation)

        if(!conversation) return res.status(400).json({error : "Conversation not found"});


        const messages = conversation.messages; // all messages 
        //console.log("Messages : ",messages)

        res.status(201).json({messages});

    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }

}