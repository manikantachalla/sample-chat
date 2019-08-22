import Card from '@material-ui/core/Card'
import * as React from 'react'
import { MessageList } from 'shared/src/common/models'

import { MessagesComponent } from './messages'
import { NewMessageComponent } from './new-message'
import { Typography, Grid } from '@material-ui/core';

export interface ChatScreenFieldProps {
    isJoinedChat: boolean
    username?: string
    messageList: MessageList
    users: string[]
}

export interface ChatScreenDispatchProps {
    onMount: () => void
    onNewMessage: (username: string, message: string) => void
}

export interface ChatScreenProps extends ChatScreenFieldProps, ChatScreenDispatchProps {

}

export interface ChatScreenState {
}

export class ChatScreenComponent extends React.Component<ChatScreenProps, ChatScreenState> {
    constructor(props: ChatScreenProps) {
        super(props);
    }

    componentDidMount() {
        this.props.onMount()
    }

    onNewMessage = (message: string) => {
        const username = this.props.username
        if (!username) {
            throw new Error("No username present")
        }
        this.props.onNewMessage(username, message)
    }

    render() {
        const { username, isJoinedChat, messageList, users } = this.props
        if (!isJoinedChat) {
            return <div>Joining Chat...</div>
        } else if (!username) {
            return <div>Fetching username...</div>
        } else {
            return <Grid container spacing={2}>
                <Grid xs={12}>
                    <h1 style={{ textAlign: "center" }}>Joined as {username}</h1>
                </Grid>
                <Grid xs={6} item>
                    <Card>
                        <MessagesComponent username={username} messageList={messageList}></MessagesComponent>
                        <NewMessageComponent onSendMessage={this.onNewMessage}></NewMessageComponent>
                    </Card>
                </Grid>
                <Grid xs={6} item>
                    <Card>
                        <Grid container spacing={1}>
                            <Grid xs={12} item>
                                <h2 style={{ textAlign: "center" }}>Recent Users</h2>
                            </Grid>
                            <Grid xs={12}>
                                <ol>
                                    {users.map(user => <li key={user}>{user}</li>)}
                                </ol>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        }
    }
}