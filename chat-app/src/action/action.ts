import { MessageList } from 'shared/src/common/models'

import { makeAction } from './model'


export const SET_CHAT_JOINED = "SET_CHAT_JOINED"
export const setChatJoined = makeAction<{}>(SET_CHAT_JOINED)

export interface SaveUsernamePayload {
    username: string
}
export const SAVE_USERNAME = "SAVE_USERNAME"
export const saveUsername = (username: string) => makeAction<SaveUsernamePayload>(SAVE_USERNAME, { username })

export type AddMessageListPayload = MessageList
export const ADD_MESSAGE_LIST = "ADD_MESSAGE_LIST"
export const addMessageList = (list: MessageList) => makeAction<AddMessageListPayload>(ADD_MESSAGE_LIST, list)

export type ReplaceMessageListPayload = MessageList
export const REPLACE_MESSAGE_LIST = "REPLACE_MESSAGE_LIST"
export const replaceMessageList = (list: MessageList) => makeAction<ReplaceMessageListPayload>(REPLACE_MESSAGE_LIST, list)

export type AddOtherUsersPayload = string[]
export const ADD_OTHER_USERS = "ADD_OTHER_USERS"
export const addOtherUsers = (list: string[]) => makeAction<AddOtherUsersPayload>(ADD_OTHER_USERS, list)
