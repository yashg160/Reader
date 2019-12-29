import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';


import CircularProgress from '@material-ui/core/CircularProgress';

import serverUrl from '../config';

import Cookies from 'js-cookie';

import PersonIcon from '@material-ui/icons/Person';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Backdrop from '@material-ui/core/Backdrop';


export default class Article extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            mainMenu: null,
            userAvatar: '',
            userName: '',
            articleBody: '',
            articleImage: '',
            articleLikes: null,
            articleReads: null,
            articleTitle: '',
            authorAbout: '',
            authorAvatar: null,
            authorName: '',
            error: false,
            errorMessage: 'ERR_NONE'
        }
    }

    async getArticle() {

        const articleId = this.props.match.params.articleId;

        let rawResponse = await fetch(serverUrl + `/article?articleId=${articleId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

        const content = await rawResponse.json();
        console.log(content);

        return content;

    }

    async getUser(userId) {
        console.log(userId);
        const url = `${serverUrl}/users?userId=${userId}`;

        const rawResponse = await fetch(url, {
            method: 'GET'
        });

        const content = await rawResponse.json()
        console.log(content);

        this.setState({ userAvatar: content.user.avatar ? content.user.avatar : '', userName: content.user.name });
        return;
    }

    componentDidMount() {
        const userId = Cookies.get('userId');

        this.getUser(userId)
            .then(() => this.getArticle())
            .then((article) => {
                // Article contains the details about the article. Set these is state to use them in render
                
                const { articleBody, articleImage, articleLikes, articleReads, articleTitle } = article;
                const { authorName, authorAbout, authorAvatar } = article.author;
                
                this.setState({ articleTitle, articleImage, articleBody, articleLikes, articleReads, authorName, authorAbout, authorAvatar, loading: false });
                console.log(this.state);
            })
            .catch(error => {
                console.error(error);
                this.setState({ loading: false });
            });

    }

    render() {

        const theme = createMuiTheme({
            palette: {
                primary: {
                    main: '#673ab7',
                },
                secondary: {
                    light: '#828282',
                    main: '#000',
                    contrastText: '#fff',
                },
            },
            typography: {
                fontFamily: 'Nunito'
            }
        });

        if (this.state.loading) {
            return (
                <Backdrop
                    open={this.state.loading}
                >
                    <CircularProgress color='#fff' />
                </Backdrop>
            )
        }

        return (
            <ThemeProvider theme={theme}>
                <div>
                    <AppBar position="sticky" style={{ backgroundColor: 'white' }}>
                        <Toolbar style={{ paddingLeft: 80, paddingRight: 80 }}>

                            <Typography variant="h5" style={{ flex: 1, color: 'black'}}>
                                <Link color='default' onClick={() => this.props.history.push('/')}>
                                    Reader
                                </Link>
                            </Typography>

                            <Button
                                variant='outlined'
                                style={{ paddingLeft: 20, paddingRight: 20, marginRight: 40, textTransform: 'capitalize' }}
                                color='primary'>
                                Upgrade
                            </Button>

                            <Avatar
                                src={this.state.userAvatar}
                                variant='circle'
                                style={{ height: '40px', width: '40px' }}
                                onClick={(event) => this.setState({ mainMenu: event.currentTarget })} >
                                <PersonIcon color='black' />
                            </Avatar>
                        </Toolbar>
                    </AppBar>

                    <Menu
                        id='main-menu'
                        anchorEl={this.state.mainMenu}
                        keepMounted
                        open={Boolean(this.state.mainMenu)}
                        onClose={() => this.setState({ mainMenu: false })}>

                        <MenuItem>
                            <Grid container direction='row' spacing={4}>
                                <Grid item container justify='center' alignItems='center'>
                                    <Avatar
                                        src={this.state.userAvatar}
                                        variant='circle'
                                        style={{ height: '64px', width: '64px' }} >
                                        <PersonIcon />
                                    </Avatar>
                                </Grid>

                                <Grid container item justify='center' alignItems='center'>
                                    <Typography variant='body1' align='center' style={{ fontSize: 24 }}>
                                        <Link color='inherit' onClick={() => this.props.history.push('/editProfile')}>
                                            {this.state.userName}
                                        </Link>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </MenuItem>

                        <MenuItem onClick={() => {
                            this.setState({ mainMenu: false });
                            this.props.history.replace('/dashboard');
                        }}
                        style={{padding: 16}}>
                            Dashboard
                        </MenuItem>

                        <MenuItem onClick={() => this.setState({ mainMenu: false })} style={{ padding: 16 }}>Help</MenuItem>
                        <MenuItem onClick={() => this.setState({ mainMenu: false })} style={{ padding: 16 }}>Sign Out</MenuItem>
                    </Menu>

                    <div style={{ marginLeft: 300, marginRight: 300, paddingTop: 100, paddingBottom: 100 }}>

                        <Typography variant='h2' style={{ marginBottom: 40 }}>
                            {this.state.articleTitle}
                        </Typography>

                        <Grid container direction='row' spacing={4} style={{marginTop: 16, marginBottom: 16}}>
                            <Grid item>
                                <Avatar
                                    src={this.state.authorAvatar}
                                    variant='circle'
                                    style={{ height: '72px', width: '72px'}}
                                >
                                    {this.state.authorName}
                                </Avatar>
                            </Grid>

                            <Grid item direction='column'>
                                <Typography variant='h5' style={{ marginTop: 8, marginBottom: 8 }}>{this.state.authorName}</Typography>
                                <Typography variant='body1' style={{ marginTop: 8, marginBottom: 8 }}>{this.state.authorAbout}</Typography>
                            </Grid>
                        </Grid>

                        <img
                            src={this.state.articleImage}
                            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                        />

                        {this.state.articleBody.split('\n').map((i, key) => {
                            return (
                                <div>
                                    <br></br>
                                    <Typography key={key}>
                                        {i}
                                    </Typography>
                                </div>

                            )
                        })}


                    </div>
                </div>
            </ThemeProvider>
        )
    }
}