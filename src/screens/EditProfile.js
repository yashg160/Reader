import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider'


import PersonIcon from '@material-ui/icons/Person';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import TextField from '@material-ui/core/TextField';


import Footer from '../components/Footer';


import serverUrl from '../config';

import Cookies from 'js-cookie';

import imageCompression from 'browser-image-compression';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';



export default class EditProfile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            disabled: true,
            userName: '',
            userAbout: '',
            userAvatar: '',
            userNameChanged: false,
            userAboutChanged: false,
            userAvatarChanged: false,
            userNameError: false,
            userNameErrorMessage: '',
            userAboutError: false,
            userAboutErrorMessage: '',
            compressing: false,
            reader: new FileReader(),
            encodedImage: '',
        }

        this.imageInput = null;

    }

    imageSelectHandler = event => {

        console.log(event.target.files[0]);

        this.setState({ compressing: true, encodedImage: null });

        var reader = this.state.reader;

        imageCompression(event.target.files[0], {
            maxSizeMB: 1
        })
            .then((file) => {
                console.log(file);
                // File is of Blob type. Convert to base64 for displaying and uploading

                reader.addEventListener('loadend', () => {
                    console.log(reader.result);
                    this.setState({ encodedImage: reader.result, userAvatarChanged: true, compressing: false });
                });

                reader.readAsDataURL(file);
            })
            .catch((error) => {
                console.error(error);
                this.setState({ compressing: false, encodedImage: this.state.userAvatar });
            });
    }

    async getUser(userId) {

        const url = `${serverUrl}/users?userId=${userId}`;

        const rawResponse = await fetch(url, {
            method: 'GET'
        });

        const content = await rawResponse.json();

        return content;

    }


    // All methods to update profile. Check in each if value has changed. Only then make the request.
    async validateName() {
        var reg = /^[A-Za-z ]+$/;
        if (!reg.test(this.state.userName)) {
            throw Error('ERR_NAME');
        }
    }

    async validateAbout() {
        if (!this.state.userAbout)
            throw Error('ERR_ABOUT');
    }

    async updateProfile() {

        const userId = Cookies.get('userId');
        console.log(userId);

        let rawResponse = await fetch(serverUrl + '/users/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                id: userId,
                name: this.state.userName,
                about: this.state.userAbout,
                avatar: this.state.userAvatarChanged ? this.state.encodedImage : null
            })
        });

        const content = await rawResponse.json();
        console.log(content);

        if (content.error)
            throw Error('ERR_UPDATE');
        
        return content;
    }

    handleProfileSubmit() {
        this.setState({ loading: true });
        this.validateName()
            .then(() => this.validateAbout())
            .then(() => this.updateProfile())
            .then((content) => {
                console.log(content);
                this.props.history.goBack();
            })
            .catch((error) => {
                console.error(error);
                this.setState({ loading: false });
                // TODO: Handle error conditions
        })
    }

    componentDidMount() {

        const userId = Cookies.get('userId');

        this.getUser(userId)
            .then((content) => {
                console.log(content);

                const { name, about, avatar } = content.user;
                
                this.setState({ userName: name, userAvatar: avatar, encodedImage: avatar, userAbout: about });
            
            }) 
            .catch(error => {
                console.error(error);
        })
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

        return (
            <ThemeProvider theme={theme}>
                <div>
                    <AppBar position="sticky" style={{ backgroundColor: 'white' }}>
                        <Toolbar style={{ paddingLeft: 80, paddingRight: 80 }}>

                            <Typography variant="h5" style={{ flex: 1, color: 'black' }} onClick={() => this.props.history.push('/dashboard')}>
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
                                <PersonIcon color='#000' />
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

                        <MenuItem onClick={() => this.props.history.push('/dashboard')} style={{ padding: 16 }}>
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

                        <div style={{paddingLeft: 300, paddingRight: 300, paddingTop: 80}}>
                            
                        <Typography variant="h4" align='center' style={{marginBottom: 8}}>
                            Your Profile
                        </Typography>

                        <Typography variant='body1' align='center' style={{ marginTop: 8 }}>
                            Update your profile
                        </Typography>

                        <Divider variant='middle' style={{marginTop: 64, marginBottom: 64, height: 4}}/>

                        <Typography align='center'>
                            <Button
                                variant='outlined'
                                style={{
                                    marginBottom: 40,
                                    textTransform: 'capitalize',
                                    paddingLeft: 40, 
                                    paddingRight: 40
                                }}
                                color='primary'
                                onClick={() => this.setState({ disabled: false })}
                            >
                                <Typography variant='h6' align='center'>
                                    Edit Profile
                                </Typography>
                            </Button>
                            {/* Show Snackbar to inform user that all fields have been enabled */}
                        </Typography>

                        <Grid container direction="row" >

                            <Grid container xs={6} item justify='center' alignItems='center' direction="column">

                                <TextField
                                    variant='standard'
                                    onChange={event => this.setState({ userName: event.target.value, userNameChanged: true })}
                                    error={this.state.userNameError}
                                    value={this.state.userName}
                                    label='Name'
                                    placeholder={'Full Name'}
                                    fullWidth
                                    style={{
                                        fontSize: 26,
                                        padding: 20,
                                        fontStyle: 'bold',
                                    }}
                                    inputProps={{ style: { textAlign: 'center', fontSize: 24 } }}
                                    disabled={this.state.disabled}/>
                                
                                <TextField
                                    variant='standard'
                                    onChange={event => this.setState({ userAbout: event.target.value, userAboutChanged: true })}
                                    error={this.state.userAboutError}
                                    value={this.state.userAbout}
                                    label='About'
                                    placeholder={'Something about you'}
                                    fullWidth
                                    multiline
                                    rowsMax={3}
                                    style={{
                                        padding: 20,
                                        fontStyle: 'bold',
                                        textAlign: 'center'
                                    }}
                                    inputProps={{ style: { textAlign: 'center' } }}
                                    disabled={this.state.disabled}/>

                            </Grid>

                            <Grid container item xs={6} justify='center' alignItems='center' direction='column'>
                                <Avatar
                                    src={this.state.encodedImage}
                                    variant='circle'
                                    style={{ height: '160px', width: '160px' }}
                                    alt={this.state.userName}
                                >
                                    {
                                        this.state.compressing ? <CircularProgress/> : <PersonIcon/>
                                    }
                                </Avatar>

                                <Button
                                    variant='outlined'
                                    color='primary'
                                    onClick={() => this.imageInput.click()}
                                    style={{ marginTop: 40, paddingLeft: 40, paddingRight: 40, textTransform: 'capitalize' }}
                                    disabled={this.state.disabled}
                                >
                                    <Typography variant='h6' align='center'>
                                        Select Picture
                                    </Typography>
                                </Button>
                                <input
                                    style={{ display: 'none' }}
                                    type='file'
                                    onChange={this.imageSelectHandler}
                                    ref={imageInput => this.imageInput = imageInput}
                                />

                            </Grid>

                        </Grid>

                        <Divider variant='middle' style={{ marginTop: 64, marginBottom: 64, height: 4 }} />

                        <Typography align='center'>
                            <Button
                                variant='contained'
                                size='large'
                                align='center'
                                color='primary'
                                onClick={() => this.handleProfileSubmit()}
                                style={{  paddingLeft: 80, paddingRight: 80 }}
                                disabled={this.state.disabled}>

                                Submit
                            </Button>
                        </Typography>
                    </div>

                    <Footer />

                    <Backdrop
                        open={this.state.loading}
                    >
                        <CircularProgress color='#fff' />
                    </Backdrop>               
                </div>
            </ThemeProvider>
        )
    }
}