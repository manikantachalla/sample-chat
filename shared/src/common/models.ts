export interface UsernameAndMessage {
    username: string
    message: string
}
export interface MessageInfo extends UsernameAndMessage {
    date: Date
    messageId: string
}

export type MessageList = MessageInfo[]