import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import PersonIcon from '@material-ui/icons/Person';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Footer from '../components/Footer';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

import serverUrl from '../config';

import Cookies from 'js-cookie';

import imageCompression from 'browser-image-compression';



export default class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            userName: '',
            userAbout: '',
            userAvatar: '',
            userNameError: false,
            userNameErrorMessage: '',
            userAboutError: false,
            userAboutErrorMessage: '',
            compressing: false,
            reader: new FileReader(),
            encodedImage: ''
        }

        this.imageInput = null;
        
    }

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

    async setProfile() {
        //Send a put request to the users endpoint to update the name and about values in the table
        const id = await Cookies.get('userId');

        const body = JSON.stringify({
            id: id,
            name: this.state.userName,
            about: this.state.userAbout,
            avatar: this.state.encodedImage
        });

        console.log(body);

        let rawResponse = await fetch(serverUrl + '/users/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: body
        });

        const content = await rawResponse.json();
        console.log(content);
        if (content.error)
            throw Error('ERR_UPDATE');
    }

    handleProfileSubmit() {
        console.log('Called handleProfileSubmit');

        this.validateName()
            .then(() => this.validateAbout())
            .then(() => this.setProfile())
            .then(() => {
                //TODO: Profile has been successfully created. Move to the dashboard
                Cookies.set('profileComplete', true);
                this.props.history.replace('/dashboard');
            })
            .catch(error => {
                //TODO: Add Snackbar for errors
                console.error(error);
            });
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
                    this.setState({ encodedImage: reader.result });
                });

                reader.readAsDataURL(file);
            })
            .catch((error) => {
                console.error(error);
                this.setState({ compressing: false, encodedImage: this.state.userAvatar });
            });
    }

    componentDidMount() {
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

                            <Typography variant="h5" style={{ flex: 1, color: '#000' }} onClick={() => this.props.history.push('/')}>
                                Reader
                            </Typography>

                        </Toolbar>
                    </AppBar>

                    <div style={{ paddingLeft: 300, paddingRight: 300, paddingTop: 80 }}>
                        <Typography variant="h4" align='center' style={{ marginBottom: 8 }}>
                            Your Profile
                        </Typography>

                        <Typography variant='body1' align='center' style={{ marginTop: 8 }}>
                            This is your profile. Make sure it looks nice.
                        </Typography>

                        <Divider variant='middle' style={{ marginTop: 64, marginBottom: 64, height: 4 }} />

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
                                />

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
                                />

                            </Grid>

                            <Grid container item xs={6} justify='center' alignItems='center' direction='column'>
                                <Avatar
                                    src={this.state.encodedImage}
                                    variant='circle'
                                    style={{ height: '160px', width: '160px' }}
                                    alt={this.state.userName}
                                >
                                    {
                                        this.state.compressing ? <CircularProgress /> : <PersonIcon />
                                    }
                                </Avatar>

                                <Button
                                    variant='outlined'
                                    color='primary'
                                    onClick={() => this.imageInput.click()}
                                    style={{ marginTop: 40, paddingLeft: 40, paddingRight: 40, textTransform: 'capitalize' }}
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
                                style={{ paddingLeft: 80, paddingRight: 80 }}>

                                Submit
                            </Button>
                        </Typography>
                    </div>

                    

                    <Footer />
                </div>
            </ThemeProvider>
        )
    }
}

