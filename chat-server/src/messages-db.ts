import { MessagesDb } from './db/Schema/messages';
import { UsersDb } from './db/Schema/users';
import { MessageList, UsernameAndMessage } from "shared/src/common/models";
import uuid = require("uuid");
import { reject } from 'bluebird';

export class MessagesStore {

    async addUserName(username: string): Promise<void> {
        await UsersDb.create({ username, isActive: true, date: new Date() })
    }

    async removeUser(username: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            UsersDb.findOneAndUpdate({ username }
                , { $set: { isActive: false } }
                , function (err, doc) {
                    if (err) {
                        return reject(err)
                    } else {
                        return resolve()
                    }
                });
        })
    }

    async getUsers(limit?: number): Promise<string[]> {
        //TODO
        return (await UsersDb.find({ isActive: true }).sort({ date: -1 }).exec())
            .map(u => (u as any).username)
    }

    async addMessage({ username, message }: UsernameAndMessage) {
        await MessagesDb.create({ username, message, date: new Date() })
    }

    getMessages(limit?: number): Promise<MessageList> {
        // TODO
        return MessagesDb.find({}).limit(limit || -1).sort({ date: 1 }).exec() as unknown as Promise<MessageList>
    }
}