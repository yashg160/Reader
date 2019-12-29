import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';


import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import Chip from '@material-ui/core/Chip';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import Input from '@material-ui/core/Input';

import Cookies from 'js-cookie';

import imageCompression from 'browser-image-compression';

import Footer from '../components/Footer';

import serverUrl from '../config';

export default class WriteArticle extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            mainMenu: null,
            userName: null,
            userAvatar: null,
            articleMenu: null,
            tagDialog: false,
            publishing: false,
            title: '',
            body: '',
            tags: [
                { word: 'Entertainment', selected: false },
                { word: 'Faishon', selected: false},
                { word: 'Finance', selected: false },
                { word: 'Fitness', selected: false},
                { word: 'Relationship', selected: false },
                { word: 'Technology', selected: false}
            ],
            selectedIndex: null,
            encodedImage: '',
            blobImage: null
        }

        this.imageInput = null;
    }

    async validateTitle() {
        if (this.state.title.length == 0)
            throw Error('ERR_NULL_TITLE');
    }

    async validateBody() {
        if (this.state.body.length == 0)
            throw Error('ERR_NULL_BODY');
    }

    async validateTag() {
        if (this.state.selectedTag == '')
            throw Error('ERR_NO_SELECTION');
    }



    async publishArticle() {
        //First get the cookie value with user id
        const userId = Cookies.get('userId');

        /*
        The steps followed to save the article in the database

        1. Insert the article in articles table 
        2. Get the article id and insert it into the users's wrtten articles array
        3. Insert the article id into the choices tables that the author has selected for it
        */
        
        const body = JSON.stringify({
            userId: userId,
            articleTitle: this.state.title,
            articleBody: this.state.body,
            articleTag: this.state.tags[this.state.selectedIndex].word.toLowerCase(),
            articleImage: this.state.encodedImage
        });
        console.log(body);
        
        const rawResponse = await fetch(serverUrl + '/article/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: body
        });

        let content = await rawResponse.json();
        console.log(content);

        return content.newBlogId;
    }

    handlePublishArticle() {
        this.setState({ publishing: true });

        this.validateTitle()
            .then(() => this.validateBody())
            .then(() => this.publishArticle())
            .then((newArticleId) => {
                this.setState({ publishing: false });
                this.props.history.replace(`/articles/${newArticleId}`);
            })
            .catch((error) => {
                console.error(error);
                this.setState({ publishing: false });
                //TODO: Snackbar for errors
            });
    }

    handleTagClick(index) {

        if (this.state.tags[index].selected) {
            this.state.tags[index].selected = false;
            this.setState({ selectedIndex: null });
        }
        else {
            if (this.state.selectedIndex != null) {

                this.state.tags[this.state.selectedIndex].selected = false;
                this.state.tags[index].selected = true;
                this.setState({ selectedIndex: index });
            }
            else {
                this.state.tags[index].selected = true;
                this.setState({ selectedIndex: index });
            }
        }
        this.forceUpdate();
    }

    imageSelectHandler = event => {
        //this.getBase64(event.target.files[0]);

        console.log(event.target.files[0]);

        imageCompression.getDataUrlFromFile(event.target.files[0])
            .then(encodedImage => {
                this.setState({ encodedImage });
                console.log(encodedImage);
            });
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

        this.getUser(userId)
        .then((content) => this.setState({ userAvatar: content.user.avatar, userName: content.user.name, loading: false}))
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
                    <CircularProgress color='default' />
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
                                variant='contained'
                                color='primary'
                                style={{ paddingLeft: 40, paddingRight: 40, marginRight: 40, textTransform: 'capitalize' }}
                                onClick={() => this.setState({ tagDialog: true })}>
                                <Typography align='center' variant='h6'>
                                    Publish   
                                </Typography>
                            </Button>
                            
                            <Avatar
                                src={this.state.userAvatar}
                                variant='circle'
                                style={{ height: '40px', width: '40px'}}
                                onClick={(event) => this.setState({ mainMenu: event.currentTarget })} />                         
                            
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
                        
                        <MenuItem onClick={() => this.props.history.push('/')} style={{ padding: 16 }}>
                            <Typography variant='body1' align='center'>
                                Dashboard
                            </Typography>
                        </MenuItem>
                        
                    <MenuItem onClick={() => this.setState({ mainMenu: false })} style={{ padding: 16 }}>
                        <Typography variant='body1' align='center'>
                            Help
                        </Typography>
                    </MenuItem>
                        
                    <MenuItem onClick={() => this.setState({ mainMenu: false })} style={{ padding: 16 }}>
                        <Typography variant='body1' align='center'>
                            Sign Out
                        </Typography>
                    </MenuItem>
                </Menu>

                <input
                    style={{ display: 'none' }}
                    type='file'
                    onChange={this.imageSelectHandler}
                    ref={imageInput => this.imageInput = imageInput}
                />

                {
                    this.state.encodedImage == '' ? 
                    
                    <div style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
                        <Typography variant='h6' align='center'>
                            No cover image selected
                        </Typography>

                        <Typography variant='body1' align='center'>
                            Here you can preview the cover image for your article. This will be displayed on the dashboard of other users.
                        </Typography>
                            
                        <Typography align='center'>
                                <Button
                                    variant='outlined'
                                    color='primary'
                                    style={{ marginTop: 20, marginBottom: 20 }}
                                    onClick={() => this.imageInput.click()}>
                                Select Image
                            </Button>
                        </Typography>
                        
                    </div>
                :
                    <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', marginTop: 40 }}>

                        <img
                            src={this.state.encodedImage}
                            style={{ objectFit: 'cover', width: '40%', height: 'auto' }}
                            />
                    </div>
                }

                <div style={{ marginLeft: 240, marginRight: 240, paddingTop: 40 }}>
                    
                    <Input
                        placeholder='Title'
                        style={{ fontSize: 32, marginTop: 80, marginBottom: 20 }}
                        fullWidth
                        multiline
                        rowsMax={3}
                        onChange={(event) => this.setState({title: event.target.value})}/>
                    
                    <Input
                        placeholder='Write your article'
                        style={{ fontSize: 18, marginTop: 20, marginBottom: 20 }}
                        fullWidth
                        multiline
                        onChange={(event) => this.setState({ body: event.target.value})}/>
                </div>

                <Dialog
                    open={this.state.tagDialog}
                    onBackdropClick={(event) => console.log('Backdrop Clicked')}
                    onClose={() => this.setState({ tagDialog: false })}
                    onExited={() => this.setState({ publishing: false })}
                    aria-labelledby="form-dialog-title"
                    style={{padding: 40}}>      
                    
                    <Typography variant='h5' align='center' style={{ margin: 20 }}>
                        One Last Thing
                    </Typography>
                            
                    <Typography variant='body1' align='center' style={{ margin: 20 }}>
                        You have almost completed your article. Just one last thing. Select a category that makes it easier for readers to find you article on Reader. Think it as a #hashtag.
                    </Typography>
                                      
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                        {
                                this.state.tags.map((tagObj, i) => (
                                    <Chip
                                        key={i}
                                        clickable
                                        color={this.state.tags[i].selected ? 'primary' : 'secondary'}
                                        icon={<CheckCircleOutlineIcon />}
                                        label={<Typography variant='body1'>{tagObj.word}</Typography>}
                                        style={{ margin: 8, padding: 16 }}
                                        onClick={() => this.handleTagClick(i)}
                                    />
                            ))
                        }
                    </div>

                    <DialogActions>
                        <Button onClick={() => this.setState({ tagDialog: false })} variant='text' color='default' style={{ textTransform: 'capitalize', fontSize: 18 }}>
                            Cancel
                        </Button>
                        {
                            this.state.publishing ?

                                <CircularProgress color='primary' size={24} variant="indeterminate" style={{ marginLeft: 40, marginRight: 40 }} />

                                :
                                <Button onClick={() => this.handlePublishArticle()} variant='contained' color="primary" style={{ textTransform: 'capitalize', color: 'white', fontSize: 18, padding: 10 }}>
                                    Publish
                                </Button>

                        }
                    </DialogActions>

                </Dialog>
                
                <Footer/>
            </div>
            </ThemeProvider>
        )
    }
}