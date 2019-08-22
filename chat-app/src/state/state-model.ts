import { MessageList } from '../.././../shared/src/common/models'

export interface AppActiveState {
    isJoinedChat?: boolean
    username?: string
}

export interface AppState {
    active: AppActiveState
    messageList: MessageList
    otherUsers: string[]
}