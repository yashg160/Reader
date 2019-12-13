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
        }
    }

    async logout() {

        let rawResponse = await fetch(serverUrl + '/users' + '/logout');

        const content = await rawResponse.json();
        console.log(content);

        Cookies.remove('userAuthenticated');
        Cookies.remove('userId');
        Cookies.remove('userEmail');
        Cookies.remove('userPassword');
        Cookies.remove('userName');

        if (content.error)
            throw Error('An error occurred while logging you out');
    }

    handleLogout() {
        console.log('Called handleLogout');

        this.logout()
            .then(() => {
                //Logout scuccessfull. Migrate back to the home page.
                this.props.history.goBack();
            })
            .catch(error => {
                //TODO
                //An error occurred. Handle by displaying snackbar
                console.log(error);
            });
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
                    
                    <MenuItem onClick={() => this.props.history.push('/newArticle')}>New Article</MenuItem>
                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Profile</MenuItem>
                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Help</MenuItem>
                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Sign Out</MenuItem>
                </Menu>
            </div>
            
        )
    }
}