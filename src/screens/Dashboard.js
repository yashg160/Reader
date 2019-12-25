import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import Cookies from 'js-cookie';

import serverUrl from '../config'; 

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            mainMenu: null,
            userAvatar: '',
            userName: '',
            articles: null,
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

        this.setState({ articles: content });

    }

    async getUser(userId) {
        console.log(userId);
        const url = `${serverUrl}/users?userId=${userId}`;

        const rawResponse = await fetch(url, {
            method: 'GET'
        });

        const content = await rawResponse.json()
        console.log(content);

        return content;
    }

    componentDidMount() {
        const userId = Cookies.get('userId');
        const userAuthenticated = Cookies.get('userAuthenticated');
        console.log(userId);

        if (userAuthenticated == null || userId == null)
            this.props.history.replace('/');
        

        this.getArticlesForUser(userId)
            .then(() => this.getUser(userId))
            .then((user) => this.setState({ userAvatar: user.user.avatar, userName: user.user.name, loading: false }))
            .catch(error => {
                console.error(error);
                this.setState({ loading: false });
            });
    }


    render() {
        if (this.state.loading)
            return <p>Loading...</p>
        
        return (
            <div>
                <AppBar position="sticky" style={{ backgroundColor: 'white' }}>
                    <Toolbar>

                        <Typography variant="h6" style={{ flex: 1, color: 'black' }}>
                            Reader
                        </Typography>

                        <Avatar src={this.state.userAvatar} variant='circle' style={{ height: '40px', width: '40px' }} onClick={(event) => this.setState({ mainMenu: event.currentTarget})}/>
                    </Toolbar>
                </AppBar>

                 
                <GridList style={{flexWrap: 'nowrap', transform: 'translateZ(0)'}} cols={5}>

                    {
                        Object.keys(this.state.articles).map((tag) => this.state.articles[tag].map(article => (

                            <GridListTile key={article.id}>
                                <img src={article.image} />

                                <GridListTileBar
                                    title={article.title}
                                />
                            </GridListTile>
                        
                        )))
                    }
                </GridList>
                

                <Menu
                    id='main-menu'
                    anchorEl={this.state.mainMenu}
                    keepMounted
                    open={Boolean(this.state.mainMenu)}
                    onClose={() => this.setState({ mainMenu: false })}>
                    
                    <MenuItem onClick={() => this.props.history.push('/writeArticle')}>New Article</MenuItem>
                    <MenuItem onClick={() => this.props.history.push('/editProfile')}>Edit Profile</MenuItem>
                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Help</MenuItem>
                    <MenuItem onClick={() => this.handleSignOutClick()}>Sign Out</MenuItem>
                </Menu>

                
                

            </div>
            
        )
    }
}