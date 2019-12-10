import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import Cookies from 'js-cookie';

import serverUrl from '../config'; 

export default class Dashboard extends React.Component {

    async logout() {

        let rawResponse = await fetch(serverUrl + '/users' + '/logout');

        const content = await rawResponse.json();
        console.log(content);

        Cookies.remove('userAuthenticated');
        Cookies.remove('userId');
        Cookies.remove('userEmail');
        Cookies.remove('userPassword');

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

                        <Button color="default" style={{ marginRight: 10, textTransform: 'capitalize', fontSize: 18 }} onClick={() => this.handleLogout()}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </div>
            
        )
    }
}