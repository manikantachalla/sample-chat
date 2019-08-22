import { connect } from 'react-redux'
import { ChatEvent, UsernameAndOldMessages } from 'shared/src/common/event'
import { MessageList } from 'shared/src/common/models'
import socketIOClient from 'socket.io-client'

import { addMessageList, saveUsername, setChatJoined, replaceMessageList, addOtherUsers } from '../action/action'
import { ChatScreenComponent, ChatScreenDispatchProps, ChatScreenFieldProps } from './../components/chat-screen'
import { AppDispatch } from './../reducers/main-reducer'
import { AppState } from './../state/state-model'


const mapStateToProps = (state: AppState): ChatScreenFieldProps => {
    return {
        isJoinedChat: !!state.active.isJoinedChat,
        username: state.active.username,
        messageList: state.messageList,
        users: state.otherUsers
    }
}

const mapDispatchToProps = (dispatch: AppDispatch): ChatScreenDispatchProps => {
    let socket: SocketIOClient.Socket | undefined
    return {
        onMount: () => {
            dispatch((dispatch, getState) => {
                socket = socketIOClient();
                socket.on("connect", function () {
                    //TODO hack
                    setTimeout(() => dispatch(setChatJoined), 1000)
                })
                socket.on(ChatEvent.username, (usernameAndOldMessages: UsernameAndOldMessages) => {
                    //TODO hack
                    setTimeout(() => {
                        dispatch(saveUsername(usernameAndOldMessages.username))
                        dispatch(replaceMessageList(usernameAndOldMessages.oldMessages))
                        dispatch(addOtherUsers(usernameAndOldMessages.users))
                    }, 1000)
                });
                socket.on(ChatEvent.messageBroadcast, (data: MessageList) => {
                    dispatch(addMessageList(data))
                });
                socket.on(ChatEvent.recentUsers, (data: string[]) => {
                    dispatch(addOtherUsers(data))
                });
            })
        },
        onNewMessage: (username: string, message: string) => {
            if (!socket) {
                throw new Error("socket is undefined")
            }
            socket.emit(ChatEvent.newMessage, { username, message })
        }
    }
}

export const ChatScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatScreenComponent)