import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Link from '@material-ui/core/Link';


import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import PersonIcon from '@material-ui/icons/Person';

import Cookies from 'js-cookie';

import serverUrl from '../config'; 

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Footer from '../components/Footer';


export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            mainMenu: null,
            userAvatar: null,
            userName: '',
            articles: null,
            tags: null
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

        this.setState({ articles: content, tags: Object.keys(content) });
        return;
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
            .then((content) => this.setState({ userAvatar: content.user.avatar, userName: content.user.name, loading: false }))
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
                        <Toolbar style={{paddingLeft: 80, paddingRight: 80}}>

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

                    <div style={{paddingLeft: 80, paddingRight: 80}}>
                        {
                            this.state.tags.map((tag) => (

                                this.state.articles[tag].length === 0 ? null :

                                <div style={{ margin: 20 }} key={tag}>
                                    <Typography variant='h4' style={{ marginBottom: 20 }}>
                                        {tag}
                                    </Typography>

                                    <GridList style={{ flexWrap: 'nowrap', transform: 'translateZ(0)' }} cols={5}>
                                        {
                                            this.state.articles[tag].map((article) => (

                                                <GridListTile
                                                    key={article.id}
                                                    style={{
                                                        height: '200px',
                                                        width: '300px',
                                                        margin: 8,
                                                        boxShadow: '0px 2px 3px 3px rgb(0,0,0,0.4)',
                                                        paddding: 0
                                                    }}>

                                                    <img src={article.image} onClick={() => this.props.history.push(`/articles/${article.id}`)}/>

                                                    <GridListTileBar
                                                        title={article.title}
                                                        style={{
                                                            padding: 4,
                                                            background: 'linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)',

                                                        }}
                                                        actionIcon={<Avatar src={article.author.avatar}></Avatar>}
                                                        subtitle={
                                                            <Link color='inherit' onClick={() => this.props.history.push(`/users/${article.author.id}`)}>
                                                                {article.author.name}
                                                            </Link>
                                                        }
                                                    >
                                                    </GridListTileBar>
                                                </GridListTile>
                                            ))
                                        }

                                    </GridList>
                                </div>

                            ))
                        }

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
                                            style={{ height: '64px', width: '64px'}} >
                                            <PersonIcon />
                                        </Avatar>
                                    </Grid>

                                    <Grid container item justify='center' alignItems='center'>
                                        <Typography variant='body1' align='center' style={{fontSize: 24}}>
                                            <Link color='inherit' onClick={() => this.props.history.push('/editProfile')}>
                                                {this.state.userName}
                                            </Link>
                                        </Typography>
                                    </Grid>
                                </Grid>
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

                        <Footer />
                    </div>
                    
                </div>
            </ThemeProvider>
            
            
        )
    }
}