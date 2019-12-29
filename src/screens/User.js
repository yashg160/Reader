import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider'

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import PersonIcon from '@material-ui/icons/Person';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';



import Footer from '../components/Footer';


import serverUrl from '../config';

import Cookies from 'js-cookie';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';


export default class User extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mainMenu: false,
            loading: true,
            userAvatar: null,
            userName: null,
            author: null,
            articles: null
        }
    }

    async getUser(userId) {
        const url = `${serverUrl}/users?userId=${userId}`;

        const rawResponse = await fetch(url, {
            method: 'GET'
        });

        const content = await rawResponse.json();

        this.setState({ userName: content.user.name, userAvatar: content.user.avatar });
    }

    async getAuthorData() {

        const userId = this.props.match.params.userId;
        const userUrl = `${serverUrl}/users?userId=${userId}`;

        let rawData = await fetch(userUrl, {
            method: 'GET'
        });

        const dataResponse = await rawData.json();
        this.setState({ author: dataResponse.user });
        
    }

    async getWrittenArticles() {
        const userId = this.props.match.params.userId;
        
        // First get all the articles written by the visited user
        const articlesUrl = `${serverUrl}/users/writtenArticles?userId=${userId}`;
      
        let rawArticles = await fetch(articlesUrl, {
            method: 'GET'
        });

        const articlesResponse = await rawArticles.json();
        this.setState({ articles: articlesResponse.articles });
    }

    async handleSignOutClick() {
        this.setState({ mainMenu: false });

        Cookies.remove('userAuthenticated');
        Cookies.remove('userId');

        this.props.history.replace('/');
    }

    componentDidMount() {
        const userId = Cookies.get('userId');
       
        this.getUser(userId)
            .then(() => this.getWrittenArticles())
            .then(() => this.getAuthorData())
            .then(() => {
                this.setState({ loading: false });
                console.log(this.state);
            })
            .catch((error) => {
                console.error(error);
                console.log(this.state);
                this.setState({ loading: false });
        })
    }

    render() {
        const theme = createMuiTheme({
            alette: {
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

        if (this.state.loading)
            return (
                <Backdrop
                    open={this.state.loading}
                >
                    <CircularProgress color='inherit' />
                </Backdrop>
            )
        
        return (
            <ThemeProvider theme={theme}>
                <div>
                    <AppBar position="sticky" style={{ backgroundColor: 'white' }}>
                        <Toolbar style={{ paddingLeft: 80, paddingRight: 80 }}>

                            <Typography variant="h5" style={{ flex: 1, color: 'black' }}>
                                <Link color='inherit' onClick={() => this.props.history.push('/')}>
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
                                style={{ height: '40px', width: '40px', borderColor: 'primary', borderWidth: 2 }}
                                onClick={(event) => this.setState({ mainMenu: event.currentTarget })} >
                                <PersonIcon />
                            </Avatar>
                        </Toolbar>
                    </AppBar>

                    <div style={{marginLeft: 300, marginRight: 300, paddingTop: 80, paddingBottom: 80}}>

                        <Grid container direction='row' spacing={0}>

                            <Grid container item xs={6} justify='center'>
                                <Avatar
                                    src={this.state.author.avatar}
                                    style={{ height: '160px', width: '160px' }}
                                    variant='circle'
                                    alt={this.state.author.name}
                                    onClick={(event) => this.setState({ mainMenu: event.currentTarget })}
                                >
                                </Avatar>
                            </Grid>

                            <Grid container item xs={6} direction='column' style={{paddingTop: 40}}>
                                <Typography variant='h4' color='inherit' style={{marginBottom: 8}}>
                                    {this.state.author.name}
                                </Typography>

                                <Typography variant='body1' color='inherit' style={{ marginTop: 8 }}>
                                    {this.state.author.about}
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        <Typography variant='h6' color='inherit' align='center' style={{ marginTop: 20, marginBottom: 20 }}>
                            Articles
                            </Typography>
                        <Grid container direction='row' style={{ marginTop: 20 }}>
                            
                            {
                                this.state.articles.map((article) => (
                                    <Grid item md={12} justify='center' style={{padding: 40, margin: 16}}>
                                        <Card style={{ maxWidth: '100%' }}>
                                            <CardActionArea>
                                                <CardMedia
                                                    component='img'
                                                    src={article.image}
                                                    alt={article.title}
                                                    title={article.title}
                                                    height='60%'
                                                    width='100%'
                                                />

                                                <CardContent>
                                                    <Typography variant='h5'>
                                                        {article.title}
                                                    </Typography>

                                                    <Typography variant='body1'>
                                                        {article.body}
                                                    </Typography>

                                                </CardContent>

                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </div>

                    <div style={{width: '100%', justifyContent: 'center'}}>
                        
                    </div>
                    
                </div>

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

                    <MenuItem onClick={() => this.props.history.push('/dasboard')} style={{ padding: 16 }}>
                        <Typography variant='body1' align='center'>
                            Dashboard
                        </Typography>
                    </MenuItem>

                    <MenuItem onClick={() => this.props.history.push('/writeArticle')} style={{ padding: 16 }}>
                        <Typography variant='body1' align='center'>
                            New Article
                        </Typography>
                    </MenuItem>

                    <MenuItem onClick={() => this.setState({ mainMenu: false })} style={{ padding: 16 }}>
                        <Typography variant='body1' align='center'>
                            Help
                        </Typography>
                    </MenuItem>

                    <MenuItem onClick={() => this.handleSignOutClick()} style={{ padding: 16 }}>
                        <Typography variant='body1' align='center'>
                            Sign Out
                        </Typography>
                    </MenuItem>
                </Menu>
            </ThemeProvider>
        )
    }
}