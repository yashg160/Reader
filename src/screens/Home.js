import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';



import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';


import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Footer from '../components/Footer';

import serverUrl from '../config';


import Cookies from 'js-cookie';



export default class Home extends React.Component{

    constructor() {
        super();

        this.state = {
            loading: true,
            dialogLoading: false,
            error: false,
            getStartedDialog: false,
            signInDialog: false,
            emailError: false,
            emailErrorMessage: '',
            passwordError: false,
            passwordErrorMessage: '',
            getStartedEmail: '',
            getStartedPassword: '',
            signInEmail: '',
            signInPassword: '',
            errorSnackbar: false,
            successSnackbar: false
        }
    }

    async validateEmail(email) {
        var reg = /\S+@\S+\.\S+/;
        if (!reg.test(email)) 
            throw Error('ERR_EMAIL');
    }

    async validatePassword(password) {
        var reg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!reg.test(password)) 
            throw Error('ERR_PASSWORD');
    }

    async insertUserIntoTable() {

        let rawResponse = await fetch(serverUrl + `/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.getStartedEmail,
                password: this.state.getStartedPassword
            }),
            
        });

        var content = await rawResponse.json();
        console.log(content);
        if (content.error && content.errorMessage=='ERR_DUP_ENTRY') 
            throw Error('ERR_DUP_ENTRY');
        else if (content.error) 
            throw Error('ERR_UNKNOWN');
        
        const user = content.user;
        Cookies.set('userId', user.id, { expires: 7 });
        Cookies.set('userAuthenticated', user.authenticated, { expires: 7 });
    }

    handleGetStartedClick() {
        console.log('Called handleGetStartedClick', this.state);
        this.setState({ dialogLoading: true, error: false, emailError: false, passwordError: false, emailErrorMessage:'' });

        this.validateEmail(this.state.getStartedEmail)
            .then(() => this.validatePassword(this.state.getStartedPassword))
            .then(() => this.insertUserIntoTable())
            .then(() => {
                //User created successfully. Procced the next screen.
                console.log('User created successfully. Will proceed to next screen');
                this.setState({ dialogLoading: false, getStartedDialog: false, successSnackbar: true });
                this.props.history.push('/profile');
            })
            .catch(error => {

                console.error(error);
                this.setState({ errorSnackbar: true });
                if (error.message == 'ERR_EMAIL')
                    this.setState({ dialogLoading: false, emailError: true, emailErrorMessage: 'Invalid Email' });
                else if (error.message == 'ERR_PASSWORD')
                    this.setState({ dialogLoading: false, passwordError: true });
                else if (error.message == 'ERR_DUP_ENTRY')
                    this.setState({ dialogLoading: false, emailError: true, emailErrorMessage: 'Email already registered' });
                else {
                    //TODO: Display some error notification or something.
                    this.setState({ dialogLoading: false });
                }
                    
            });
    }

    async findUser() {
        
        var rawResponse = await fetch(serverUrl + `/users/signin?email=${this.state.signInEmail}&password=${this.state.signInPassword}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        var content = await rawResponse.json();
        console.log(content);

        if (content.error) 
            throw Error(content.errorMessage);
        
        //No error. So set the cookies, that are available on the entire site
        const user = content.user;
        Cookies.set('userId', user.id, { expires: 7 });
        Cookies.set('userAuthenticated', user.authenticated, { expires: 7 });
    }

    handleSignInClick() {
        console.log('Called handleSignInClick');

        this.setState({ dialogLoading: true, error: false, emailError: false, passwordError: false, emailErrorMessage: '', passwordErrorMessage: '' });

        const { signInEmail } = this.state;

        this.validateEmail(signInEmail)
            .then(() => this.findUser())
            .then(() => {
                //User exists. Password verified in previous method. Proceed to next page
                console.log('Email and password were correct. Will proceed to next screen');
                
                this.setState({ dialogLoading: false, signInDialog: false, successSnackbar: true });
                this.props.history.push('/dashboard')

            })
            .catch(error => {
                console.error(error);
                this.setState({ errorSnackbar: true });
                //TODO: Error message for ERR_SERVER and else case
                if (error.message == 'ERR_EMAIL')
                    this.setState({ dialogLoading: false, emailError: true, emailErrorMessage: 'Invalid Email' });
                else if (error.message == 'ERR_SERVER' || error.message == 'ERR_DUP_ACC')
                    this.setState({ dialogLoading: false });
                else if (error.message == 'ERR_USER_EXISTS')
                    this.setState({ dialogLoading: false, emailError: true, emailErrorMessage: 'No such account exists' });
                else if (error.message == 'ERR_PASSWORD')
                    this.setState({ dialogLoading: false, passwordError: true, passwordErrorMessage: 'Incorrect password. Try again' });
                else
                    this.setState({ dialogLoading: false})
            });
        
    }

    componentDidMount() {

        //Get the userAuthentcated cookie. If it is true, then move to the dashboard screen. Else, display this page
        //to allow the user to signup.

        const userAuthenticated = Cookies.get('userAuthenticated');
        console.log('Cookie userAuthenticated: ', userAuthenticated);

        if (userAuthenticated)
            this.props.history.push('/dashboard');
        else
            this.setState({ loading: false });
    }
    
    render() {

        const tags = [
            'Entertainment',
            'Faishon',
            'Finance',
            'Fitness',
            'Relationship',
            'Technology'
        ]
        
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
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 200}}>
                    <CircularProgress variant="indeterminate" color="secondary" size={40}/>
                </div>
                
            )
        }

        return (
            <ThemeProvider theme={theme}>
                <div>
                    <AppBar position="sticky" style={{ backgroundColor: 'white', }}>
                        <Toolbar style={{paddingLeft: 80, paddingRight: 80}}>

                            <Typography variant="h6" style={{ flex: 1, color: 'black' }} onClick={() => this.props.history.push('/dashboard')}>
                                Reader
                            </Typography>

                            <Button color="default" style={{ textTransform: 'capitalize', fontSize: 18 }}>Write</Button>
                            <Button color="default" style={{ marginRight: 10, textTransform: 'capitalize', fontSize: 18 }} onClick={() => this.setState({ signInDialog: true })}>Sign In</Button>
                            <Button variant='contained' color='primary' style={{ marginLeft: 10, paddingTop: 10, paddingBottom: 10, paddingRight: 20, paddingLeft: 20, textTransform: 'capitalize', fontSize: 18 }} onClick={() => this.setState({ getStartedDialog: true })}>Get Started</Button>
                        </Toolbar>
                    </AppBar>

                    <div style={{ marginLeft: 120, marginRight: 120 }}>

                        <Typography align="center" variant="h1" style={{ marginTop: 80 }}>
                            Read about what matters to you
                        </Typography>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: 40, marginBottom: 40 }}>
                            {
                                tags.map((tag) => (
                                    <Chip
                                        color='secondary'
                                        icon={<CheckCircleOutlineIcon color='primary' fontSize='large'/>}
                                        label={<Typography variant='h6'>{tag}</Typography>}
                                        style={{ margin: 16, padding: 32, borderRadius: 32, boxShadow: '4px 4px 4px 4px rgba(0,0,0,0.4)' }}
                                    />
                                ))
                            }
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 40, marginBottom: 40 }}>
                            <Typography variant="h5" align="center">
                                We offer a wide range of topics. Read anything you want.
                            </Typography>

                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 40 }}>
                            <Button variant="contained" color='primary' style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 100, paddingRight: 100, textTransform: 'capitalize', fontSize: 24, borderRadius: 30, boxShadow: '4px 4px 4px 4px rgba(0,0,0,0.2)' }}>
                                Get Started
                            </Button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 20, marginBottom: 80 }}>
                            <Typography variant="body1" align="center" style={{fontSize: 20}}>
                                Already have an account? <Link to="#">Sign In</Link>
                            </Typography>
                        </div>

                        <Divider variant="middle" style={{ marginTop: 100, marginBottom: 100, height: '4px', marginLeft: 'auto', marginRight: 'auto' }}/>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: 100, marginBottom: 40 }}>
                            <Chip
                                color='primary'
                                variant='outlined'
                                icon={<CheckCircleOutlineIcon fontSize = 'large' />}
                                label={<Typography variant='h6'>Many Topics</Typography>}
                                style={{ margin: 16, padding: 32, borderRadius: 32, boxShadow: '2px rgba(0,0,0,0.6)' }}
                            />
                            <Chip
                                color='primary'
                                variant='outlined'
                                icon={<CheckCircleOutlineIcon fontSize='large' />}
                                label={<Typography variant='h6'>Free Reading</Typography>}
                                style={{ margin: 16, padding: 32, borderRadius: 32 }}
                            />
                            <Chip
                                color='primary'
                                variant='outlined'
                                icon={<CheckCircleOutlineIcon fontSize='large' />}
                                label={<Typography variant='h6'>Free Writing</Typography>}
                                style={{ margin: 16, padding: 32, borderRadius: 32 }}
                            />
                            <Chip
                                icon={<CheckCircleOutlineIcon fontSize='large' />}
                                label={<Typography variant='h5'>On Reader, all for you.</Typography>}
                                style={{ margin: 20, padding: 36, borderRadius: 36, backgroundColor:'transparent' }}
                            />
                        </div>

                        <div style={{ marginTop: 120, marginBottom: 40 }}>
                            <Typography variant="h2">
                                No ads. Ever.
                        </Typography>
                            <Typography variant="h6">
                                We don't sell your data or target you with ads.
                        </Typography>
                        </div>

                        <Grid container direction="row" style={{ marginTop: 100, marginBottom: 100 }}>

                            <Grid container item alignItems="center" justify='center' xs={12} md={6}>

                                <Button variant="contained" color='primary' style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 100, paddingRight: 100, fontSize: 24, textTransform: 'capitalize', borderRadius: 30, boxShadow: '4px 4px 4px 4px rgba(0,0,0,0.2)'  }}>
                                    Get Started
                                </Button>

                            </Grid>

                            <Grid container item alignItems='center' justify='center' xs={12} md={6}>
                                <Typography variant="h4" align='center'>
                                    We are different than others
                                </Typography>

                                <Typography variant="body1" align='center' style={{ marginTop: 40, fontSize: 20 }}>
                                    Reader is not like any other platform on the internet. Our sole purpose is to help you find compelling ideas, knowledge, and perspectives. We don’t serve ads—we serve you, the curious reader who loves to learn new things. Reader is home to thousands of independent voices, and we combine humans and technology to find the best reading for you—and filter out the rest.
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider variant="middle" style={{ marginTop: 100, marginBottom: 100, height: '4px', marginLeft: 'auto', marginRight: 'auto' }} />

                        <div style={{ marginTop: 80, marginBottom: 80 }}>
                            <Typography align="center" variant="h1" style={{ marginTop: 20 }}>
                                Expand your reading.
                    </Typography>

                            <Typography align="center" variant="h1" style={{ marginTop: 20, marginBottom: 20 }}>
                                Expand your mind.
                    </Typography>
                        </div>

                    </div>

                    <Footer />

                    <Dialog open={this.state.getStartedDialog}
                        onClose={() => this.setState({ getStartedDialog: false })}
                        onExited={() => this.setState({ emailError: false, emailErrorMessage: '', passwordError: false, passwordErrorMessage: '' })}
                        aria-labelledby="form-dialog-title" >
                        <Grid container direction="column" align="center" justify="center">

                            <Grid item xs={12}>

                                <DialogTitle id="form-dialog-title">Get Started</DialogTitle>

                            </Grid>

                            <Grid item xs={12}>
                                <DialogContent>

                                    <DialogContentText style={{ display: 'flex', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                                        You need an account to read and write blogs. Please enter a valid email and a password. Your password is safe with us. We promise.
                                </DialogContentText>

                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="email-getstarted"
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        error={this.state.emailError}
                                        helperText={this.state.emailErrorMessage}
                                        disabled={this.state.dialogLoading}
                                        onChange={event => this.setState({ getStartedEmail: event.target.value })}
                                    />

                                    <TextField
                                        margin="dense"
                                        id="password-getstarted"
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        error={this.state.passwordError}
                                        disabled={this.state.dialogLoading}
                                        onChange={event => this.setState({ getStartedPassword: event.target.value })}
                                        helperText='At least 6 characters, one uppercase and one lowercase'
                                    />

                                </DialogContent>
                            </Grid>

                        </Grid>

                        <DialogActions>
                            <Button onClick={() => this.setState({ getStartedDialog: false })} variant='text' color='default' style={{ textTransform: 'capitalize', fontSize: 18 }}>
                                Cancel
                        </Button>
                            {
                                this.state.dialogLoading ?

                                    <CircularProgress color='primary' size={24} variant="indeterminate" style={{ marginLeft: 40, marginRight: 40 }} />

                                    :
                                    <Button onClick={() => this.handleGetStartedClick()} variant='contained' color="primary" style={{ textTransform: 'capitalize', color: 'white', fontSize: 18, padding: 10 }}>
                                        Sign Up
                                </Button>

                            }
                        </DialogActions>

                    </Dialog>

                    <Dialog open={this.state.signInDialog}
                        onClose={() => this.setState({ signInDialog: false })}
                        onExited={() => this.setState({ emailError: false, emailErrorMessage: '', passwordError: false, passwordErrorMessage: '' })}
                        aria-labelledby="form-dialog-title" >

                        <Grid container direction="column" align="center" justify="center">

                            <Grid item xs={12}>

                                <DialogTitle id="form-dialog-title">Sign In</DialogTitle>

                            </Grid>

                            <Grid item xs={12}>
                                <DialogContent>

                                    <DialogContentText style={{ display: 'flex', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                                        You must already have an account to sign in. Please enter your email id and password. If you don't have an account, then sign up.
                                </DialogContentText>

                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="username-signin"
                                        label="Username"
                                        type="text"
                                        fullWidth
                                        error={this.state.emailError}
                                        helperText={this.state.emailErrorMessage}
                                        disabled={this.state.dialogLoading}
                                        onChange={event => this.setState({ signInEmail: event.target.value })}
                                    />

                                    <TextField
                                        margin="dense"
                                        id="password-signin"
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        error={this.state.passwordError}
                                        helperText={this.state.passwordErrorMessage}
                                        disabled={this.state.dialogLoading}
                                        onChange={event => this.setState({ signInPassword: event.target.value })}
                                    />

                                </DialogContent>
                            </Grid>

                        </Grid>

                        <DialogActions>
                            <Button onClick={() => this.setState({ signInDialog: false })} variant='text' color='default' style={{ textTransform: 'capitalize', fontSize: 18, padding: 10 }}>
                                Cancel
                        </Button>
                            {/*TODO: Complete the sign up functionality*/}
                            {
                                this.state.dialogLoading ?

                                    <CircularProgress color='primary' size={24} variant="indeterminate" style={{ marginLeft: 40, marginRight: 40 }} />

                                    :
                                    <Button onClick={() => this.handleSignInClick()} variant='contained' color='primary' style={{ textTransform: 'capitalize', color: 'white', fontSize: 18, padding: 10 }}>
                                        Sign In
                            </Button>

                            }
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.errorSnackbar}
                        autoHideDuration={3000}
                        onClose={() => this.setState({ errorSnackbar: false })}
                        message={
                            <Typography variant='body1'>
                                An error occurred
                        </Typography>
                        }
                        action={[
                            <IconButton
                                key="close"
                                aria-label="closse"
                                color="default"
                                onClick={() => this.setState({ errorSnackbar: false })}>
                                <CloseIcon color='#fff' />
                            </IconButton>,
                        ]}
                    >
                    </Snackbar>

                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.successSnackbar}
                        autoHideDuration={3000}
                        onClose={() => this.setState({ successSnackbar: false })}
                        message={
                            <Typography variant='body1'>
                                Success!
                        </Typography>
                        }
                        action={[
                            <IconButton
                                key="close"
                                aria-label="closse"
                                color="default"
                                onClick={() => this.setState({ successSnackbar: false })}>
                                <CloseIcon color='#fff' />
                            </IconButton>,
                        ]}
                    >
                    </Snackbar>

                </div>
            </ThemeProvider>
           
            
        )
    }
}