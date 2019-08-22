import { uniq } from 'lodash';
import { MessageList } from 'shared/src/common/models'

import { SET_CHAT_JOINED, AddOtherUsersPayload, ADD_OTHER_USERS } from '../action/action'
import { Action } from '../action/model'
import { AppActiveState } from '../state/state-model'
import {
    ADD_MESSAGE_LIST,
    AddMessageListPayload,
    REPLACE_MESSAGE_LIST,
    ReplaceMessageListPayload,
    SAVE_USERNAME,
    SaveUsernamePayload,
} from './../action/action'

type ActivePayLoadType = SaveUsernamePayload
//Few actions of active as handled from commonReducer in shared dir
export function activeReducer(state: AppActiveState = {}, action: Action<ActivePayLoadType>): AppActiveState {
    const p = action.payload
    switch (action.type) {
        case SET_CHAT_JOINED:
            return { ...state, isJoinedChat: true }
        case SAVE_USERNAME:
            return { ...state, username: (p as SaveUsernamePayload).username }
    }
    return state
}

export function messageListReducer(state: MessageList = [], action: Action<AddMessageListPayload | ReplaceMessageListPayload>): MessageList {
    const p = action.payload
    switch (action.type) {
        case ADD_MESSAGE_LIST:
            return state.concat(p as AddMessageListPayload)
        case REPLACE_MESSAGE_LIST:
            return (p as ReplaceMessageListPayload)
    }
    return state
}

export function otherUsersReducer(state: string[] = [], action: Action<AddOtherUsersPayload>): string[] {
    const p = action.payload
    switch (action.type) {
        case ADD_OTHER_USERS:
            return p as AddOtherUsersPayload
    }
    return state
}