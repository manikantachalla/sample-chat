import { MessageList, UsernameAndMessage } from "shared/src/common/models";
import uuid = require("uuid");

export class MessagesStore {
    private usernames: string[] = []
    private messages: MessageList = []

    addUserName(username: string) {
        this.usernames.push(username)
    }

    removeUser(username: string) {
        const index = this.usernames.indexOf(username)
        if (index >= 0) {
            this.usernames.splice(index, 1)
        }
    }

    getUsers(limit?: number): string[] {
        const usernames = limit ? this.usernames.slice(-limit) : this.usernames.slice()
        return usernames
    }

    addMessage({ username, message }: UsernameAndMessage) {
        this.messages.push({ username, message, date: new Date(), messageId: uuid() })
    }

    getMessages(limit?: number) {
        const messages = limit ? this.messages.slice(-limit) : this.messages.slice()
        return messages.sort((l, r) => l.date > r.date ? 1 : -1)
    }
}