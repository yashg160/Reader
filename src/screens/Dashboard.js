import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Cookies from 'js-cookie';

import serverUrl from '../config'; 

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mainMenu: null,
            userId:'',
        }
    }

    async handleSignOutClick() {
        this.setState({ mainMenu: false });

        Cookies.remove('userAuthenticated');
        Cookies.remove('userId');

        this.props.history.replace('/');
    }

    async getArticlesForUser(userId) {

        const url = `${serverUrl}/article/forUser?id=${userId}`;
        console.log(url);

        const rawResponse = await fetch(url, {
            method: 'GET'
        });

        let content = await rawResponse.json();
        console.log(content);

    }

    componentDidMount() {
        const userId = Cookies.get('userId');
        const userAuthenticated = Cookies.get('userAuthenticated');
        console.log(userId);

        if (userAuthenticated == null || userId == null)
            this.props.history.replace('/');
        
        this.setState({ userId });

        this.getArticlesForUser(userId)
            .then(() => console.log('Done'))
            .catch(error => console.error(error));
    }


    render() {
        return (
            <div>
                <AppBar position="sticky" style={{ backgroundColor: 'white' }}>
                    <Toolbar>

                        <Typography variant="h6" style={{ flex: 1, color: 'black' }}>
                            Reader
                        </Typography>

                        <Avatar variant='circle' style={{ height: '40px', width: '40px' }} onClick={(event) => this.setState({ mainMenu: event.currentTarget})}/>
                    </Toolbar>
                </AppBar>

                <Menu
                    id='main-menu'
                    anchorEl={this.state.mainMenu}
                    keepMounted
                    open={Boolean(this.state.mainMenu)}
                    onClose={() => this.setState({ mainMenu: false })}>
                    
                    <MenuItem onClick={() => this.props.history.push('/writeArticle')}>New Article</MenuItem>
                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Profile</MenuItem>
                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Help</MenuItem>
                    <MenuItem onClick={() => this.handleSignOutClick()}>Sign Out</MenuItem>
                </Menu>

                <Grid>

                    <Grid item direction='column' justify='center' alignItems='center'>

                    </Grid>

                    <Grid item direction='column' justify='center' alignItems='center'>

                    </Grid>

                    <Grid item direction='column' justify='center' alignItems='center'>

                    </Grid>
                </Grid>
            </div>
            
        )
    }
}