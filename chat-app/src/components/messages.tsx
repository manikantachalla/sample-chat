import * as React from 'react'
import { MessageInfo } from 'shared/src/common/models'
import { Grid, Card } from '@material-ui/core';

export interface MessagesProps {
    username: string
    messageList: MessageInfo[]
}

export interface MessagesState {
}

export class MessagesComponent extends React.Component<MessagesProps, MessagesState> {
    constructor(props: MessagesProps) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
    }
    render() {
        const { messageList, username } = this.props;
        return <Grid container spacing={1}>
            <Grid xs={12} item>
                <h2 style={{ textAlign: "center" }}>Messages</h2>
            </Grid>
            <Grid xs={12} item>
                <Grid container spacing={1}>
                    {messageList.map((msg, ind) => {
                        const ele1 = <Grid item xs={4} ></Grid>
                        const ele2 = <Grid item xs={8} >
                            <Card> 
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        {msg.username}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {msg.message}
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        //can be made as seperate component
                        return msg.username == username ? [ele1, ele2] : [ele2, ele1]
                    })}
                </Grid>
            </Grid>
        </Grid>
    }
}