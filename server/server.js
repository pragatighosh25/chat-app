import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';
import { connectDB } from './lib/db.js';
import { Server } from 'socket.io';

//create express app nd http server
const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
};

//initialize socket.io
export const io = new Server(server, {
    cors: corsOptions,
});

//store online users
export const userSocketMap = {}; // { userId: socketId }

//socket.io connection handler
io.on('connection', (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId}`);

    if(userId) {
        userSocketMap[userId] = socket.id;
    }

    //emit online users to all clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
        delete userSocketMap[userId];
        //emit online users to all clients
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});



//middleware
app.use(express.json({limit: '5mb'}));


app.use(cors(corsOptions));



//routes
app.get('/api/status', (req, res) => {
    res.send('Server is running');
});
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);



//connect to the database
await connectDB();

//port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} http://localhost:${PORT}`);
});

