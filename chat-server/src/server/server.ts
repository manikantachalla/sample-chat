import { MongooseDb } from './../db/connection';
import '../../set-up'

import express from 'express'
import * as http from 'http'
import { ChatEvent, UsernameAndOldMessages } from 'shared/src/common/event'
import { UsernameAndMessage } from 'shared/src/common/models'
import socketIo from 'socket.io'

import { Config } from '../../config/config'
import { Routes } from '../routes/routes'
import { MessagesStore } from './../messages-db'
import { getRandomUsername } from './../utils/username'
import { errorMiddleware, notFound404 } from './middlewares/error'
import { staticServe } from './middlewares/static'

async function startServer() {
    const port = process.env.PORT || 4001;
    const config = Config.server
    const app = express();
    staticServe(app)
    Routes.api(app, config)
    const html404Path = config.staticPath ? (config.staticPath + "/404.html") : undefined
    notFound404(app, html404Path)
    errorMiddleware(app, config)
    const server = http.createServer(app);
    await MongooseDb.connectDB(config.dbConfig)
    const io = socketIo(server);
    const messagesStore = new MessagesStore()
    const onConnect = async (socket: socketIo.Socket) => {
        const newUserName = getRandomUsername()
        console.log("New client connected " + newUserName);
        socket.on("disconnect", () => {
            messagesStore.removeUser(newUserName)
            console.log("Client disconnected " + newUserName);
        });
        await messagesStore.addUserName(newUserName)
        const oldMessages = await messagesStore.getMessages(10)
        const users = await messagesStore.getUsers()
        const usernameAndOldMessages: UsernameAndOldMessages = {
            username: newUserName,
            oldMessages,
            users
        }
        socket.emit(ChatEvent.username, usernameAndOldMessages); // Emitting a new message. It will be consumed by the client
        socket.on(ChatEvent.newMessage, (data: UsernameAndMessage) => {
            messagesStore.addMessage(data)
            io.emit(ChatEvent.messageBroadcast, [data])
        })
        io.emit(ChatEvent.recentUsers, users)
    }

    io.on("connection", socket => {
        onConnect(socket)
    });

    server.listen(port, () => console.log(`Listening on port ${port}`));
}

startServer().catch(e => console.error(e.message))