//get all users except the logged-in user

import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { generateToken } from '../lib/jwt.js';
import Message from '../models/messages.model.js';

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