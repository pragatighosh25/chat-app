import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';

//create express app nd http server
const app = express();
const server = http.createServer(app);

//middleware
app.use(express.json({limit: '5mb'}));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';

//routes
app.get('/api/status', (req, res) => {
    res.send('Server is running');
});
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

import { connectDB } from './lib/db.js';

//connect to the database
await connectDB();

//port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} http://localhost:${PORT}`);
});

