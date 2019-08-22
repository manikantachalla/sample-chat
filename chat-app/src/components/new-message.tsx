import * as React from 'react'
import { Button, TextField, Grid } from '@material-ui/core';

export interface NewMessageProps {
    onSendMessage: (message: string) => void
}

export interface NewMessageState {
    message: string
}

export class NewMessageComponent extends React.Component<NewMessageProps, NewMessageState> {
    constructor(props: NewMessageProps) {
        super(props);
        this.state = { message: "" };
    }

    componentDidMount() { }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ message: event.currentTarget.value })
    }

    onSubmit = () => {
        const { message } = this.state
        if (message) {
            this.props.onSendMessage(message)
            this.setState({ message: "" })
        }
    }

    handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode == 13) {
            this.onSubmit()
        }
    }

    render() {
        return <Grid container spacing={1}>
            <Grid item xs={8}>
                <TextField
                    id="standard-name"
                    label="New Message"
                    onKeyDown={this.handleKeyDown}
                    value={this.state.message}
                    onChange={this.handleChange}
                    margin="none"
                />
            </Grid>
            <Grid item xs={4}>
                <Button variant="contained" color="primary" disabled={!this.state.message} onClick={this.onSubmit}>Send </Button>
            </Grid>
        </Grid>
    }
}