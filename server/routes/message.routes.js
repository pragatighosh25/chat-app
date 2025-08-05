import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getMessages, getUsersForChat, markMessagesAsSeen } from '../controllers/message.controller.js';

const messageRouter = express.Router();

messageRouter.get('/users', authMiddleware, getUsersForChat);
messageRouter.get('/:id', authMiddleware, getMessages);
messageRouter.get('/mark/:id', authMiddleware, markMessagesAsSeen);

export default messageRouter;