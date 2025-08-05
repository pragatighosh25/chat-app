import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { generateToken } from '../lib/jwt.js';
import Message from '../models/messages.model.js';
import cloudinary from '../lib/cloudinary.js'

//get all users except the logged-in user

export const getUsersForChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');

    //count number of unseen messages for each user
    const unseenMessages= {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if(messages.length > 0)
        unseenMessages[user._id] = messages.length;
      else
        unseenMessages[user._id] = 0;
    });

    await Promise.all(promises);

    return res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.json({ success: false, message: "Internal server error" });
  }
}

//get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    // Fetch messages between the current user and the selected user
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    return res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    return res.json({ success: false, message: "Internal server error" });
  }
}

//Api to mark messages as seen using the message id
export const markMessagesAsSeen = async (req, res) => {
  try {
    const {id}= req.params;
    await Message.findByIdAndUpdate(
      id,
      { seen: true }
    );
    
    return res.json({ success: true, message: "Messages marked as seen" });
  } catch (error) {
    console.error("Error marking messages as seen:", error.message);
    return res.json({ success: false, message: "Internal server error" });
  }
}

//send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const {text, image}= req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    //upload image to cloudinary if provided
    let imageUrl;
    if(image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url;
    }

    //store data in the database
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    //send response
    return res.json({ success: true, message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error.message);
    return res.json({ success: false, message: error.message || "Internal server error" });
  }
}