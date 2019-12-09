import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

export default class Profile extends React.Component {
    render() {
        return (
            <div>
                <AppBar position="sticky" style={{ backgroundColor: 'white' }}>
                    <Toolbar>

                        <Typography variant="h6" style={{ flex: 1, color: 'black' }}>
                            Reader
                        </Typography>

                        <Button color="inherit" style={{ textTransform: 'capitalize', fontSize: 18 }}>Write</Button>
                        <Button color="inherit" style={{ marginRight: 10, textTransform: 'capitalize', fontSize: 18 }} onClick={() => this.setState({ signInDialog: true })}>Sign In</Button>
                        <Button color="inherit" style={{ backgroundColor: "green", marginLeft: 10, paddingTop: 10, paddingBottom: 10, textTransform: 'capitalize', fontSize: 18 }} onClick={() => this.setState({ getStartedDialog: true })}>Get Started</Button>
                    </Toolbar>
                </AppBar>

                <Grid container direction="row" justify='center' align='center'>

                    <Grid item xs={12} sm={6} direction="column">
                        <Typography>
                            {/* TODO: The name of the user in large font */}
                        </Typography>
                        <Typography>
                            {/*TODO:  The about line of the user */}
                        </Typography>
                        {/* TODO: Button to edit profile. New screen opens */}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Avatar variant='circle'>
                            {/* TODO: Avatar of the user. Click to edit */}
                        </Avatar>
                    </Grid>

                </Grid>
            </div>
        )
    }
}