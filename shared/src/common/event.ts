import { MessageList } from "./models";

export enum ChatEvent {
    username = "username",
    newMessage = "new-message",
    messageBroadcast = "message-broadcast",
    userAdded = "user-added",
    recentUsers = "recent-users"
}

export interface UsernameAndOldMessages {
    username: string
    oldMessages: MessageList
    users: string[]
}