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

import Footer from '../components/Footer';

import url from '../config';


export default class Home extends React.PureComponent{

    constructor() {
        super();

        this.state = {
            loading: false,
            error: false,
            getStartedDialog: false,
            signInDialog: false,
            emailError: false,
            passwordError: false,
            getStartedEmail: '',
            getStartedPassword: '',
            signInEmail: '',
            signInPassword: ''
        }
    }

    classes = {
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            '& > *': {
                margin: 10,
            },
            marginLeft: 80,
            marginRight: 80,
            marginTop: 100
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }
    }

    async validateEmail(email) {
        var reg = /\S+@\S+\.\S+/;
        if (!reg.test(email)) {
            throw Error('ERR_EMAIL');
        }
    }

    async validatePassword(password) {
        var reg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!reg.test(password)) {
            throw Error('ERR_PASSWORD');
        }
    }

    async insertUserIntoTable() {

        let rawResponse = await fetch(url + `/users`, {
            method: 'POST',
            mode: 'no-cors',
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
    }

    async createUser() {
        


    }

    handleGetStartedClick() {
        console.log('Called handleGetStartedClick', this.state);
        this.setState({ loading: true });

        this.validateEmail(this.state.getStartedEmail)
            .then(() => this.validatePassword(this.state.getStartedPassword))
            .then(() => this.insertUserIntoTable())
            .then(() => {
                this.setState({ loading: false})
            })
            .catch(error => {
                this.setState({ loading: false });
                console.error(error);
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

                        <Button color="inherit" style={{textTransform: 'capitalize', fontSize: 18}}>Write</Button>
                        <Button color="inherit" style={{ marginRight: 10, textTransform: 'capitalize', fontSize: 18 }} onClick={() => this.setState({ signInDialog: true})}>Sign In</Button>
                        <Button color="inherit" style={{ backgroundColor: "green", marginLeft: 10, paddingTop: 10, paddingBottom: 10, textTransform: 'capitalize', fontSize: 18}} onClick={() => this.setState({ getStartedDialog: true})}>Get Started</Button>
                    </Toolbar>
                </AppBar>

                <Typography align="center" variant="h1" style={{marginLeft: 80, marginRight: 80, marginTop: 80}}>
                    Read about what matters to you
                </Typography>

                <div style={this.classes.root}>
                    <Chip
                        icon={<CheckCircleOutlineIcon/>}
                        label="Clickable deletable"
                        style={{margin: 10}}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Clickable deletable"
                        style={{ margin: 10 }}
                    />
                </div>

                <div style={{ marginTop: 80, marginBottom: 20, marginRight: 'auto', marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant="h6" align="center">
                        We offer a wide range of topics. Read anything you want.
                    </Typography>
                </div>

                <div style={{ marginTop: 20, marginBottom: 10, marginRight: 'auto', marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button variant="contained" style={{paddingTop: 20, paddingBottom: 20, paddingLeft: 80, paddingRight: 80}}>
                        Get Started
                    </Button>
                </div>

                <div style={{ marginTop:10, marginBottom: 20, marginRight: 'auto', marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body1" align="center">
                        Already have an account? <Link to="#">Sign In</Link>
                    </Typography>
                </div>

                <div style={this.classes.root}>
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Many topics"
                        style={{ margin: 10, backgroundColor: 'transparent' }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Free reading"
                        style={{ margin: 10, backgroundColor: 'transparent' }}
                    />
                    <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label="Free writing"
                        style={{ margin: 10, backgroundColor: 'transparent' }}
                    />
                    <Chip
                        label={<Typography variant="h6">On Reader, all for you.</Typography>}
                        style={{ margin: 10, backgroundColor: 'transparent' }}
                    />
                </div>

                <Typography variant="h2" style={{marginLeft: 80, marginTop: 80}}>
                    No ads. Ever.
                </Typography>
                <Typography variant="h6" style={{ marginLeft: 80, marginTop: 10 }}>
                    We don't sell your data or target you with ads. 
                </Typography>
                
                <Grid container direction="row">

                    <Grid item align="center" xs={12} md={6} style={{padding: 80}}>
                        <Button variant="contained" style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 80, paddingRight: 80 }}>
                            Get Started
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={6} style={{ padding: 80 }}>
                        <Typography variant="h5">
                            We are different than others
                        </Typography>

                        <Typography variant="body1" style={{marginTop: 20}}>
                            Medium is not like any other platform on the internet. Our sole purpose is to help you find compelling ideas, knowledge, and perspectives. We don’t serve ads—we serve you, the curious reader who loves to learn new things. Medium is home to thousands of independent voices, and we combine humans and technology to find the best reading for you—and filter out the rest.
                        </Typography>
                    </Grid>
                </Grid>    

                <Divider variant="middle" style={{ marginTop: 80, marginBottom: 80, height: '4px', marginLeft: 300, marginRight: 300, backgroundColor: 'red' }} />
                
                <Typography align="center" variant="h1" style={{ marginLeft: 80, marginRight: 80, marginTop: 20}}>
                    Expand your reading.
                </Typography>

                <Typography align="center" variant="h1" style={{ marginLeft: 80, marginRight: 80, marginTop: 20, marginBottom: 80 }}>
                    Expand your mind.
                </Typography>

                <Dialog open={this.state.getStartedDialog} onClose={() => this.setState({ getStartedDialog: false})} aria-labelledby="form-dialog-title" >
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
                                    onChange={event => this.setState({ getStartedEmail: event.target.value })}
                                />

                                <TextField
                                    margin="dense"
                                    id="password-getstarted"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    error={this.state.passwordError}
                                    onChange={event => this.setState({ getStartedPassword: event.target.value })}
                                />

                            </DialogContent>
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button onClick={() => this.setState({ getStartedDialog: false })} color="black" style={{ textTransform: 'capitalize', fontSize: 18 }}>
                            Cancel
                                    </Button>
                        {/*TODO: Complete the sign up functionality*/}
                        {
                            this.state.loading ?
                                
                                <CircularProgress color='primary' size={24} variant="indeterminate" style={{ marginLeft: 40, marginRight: 40}} />
                                
                            :
                                <Button onClick={() => this.handleGetStartedClick()} color="primary" style={{ textTransform: 'capitalize', color: 'white', fontSize: 18, backgroundColor: 'green', padding: 10 }}>
                                Sign Up
                                </Button>
                                    
                        }
                    </DialogActions>
                    
                </Dialog>

                <Dialog open={this.state.signInDialog} onClose={() => this.setState({ signInDialog: false })} aria-labelledby="form-dialog-title" >

                    <Grid container direction="column" align="center" justify="center">

                        <Grid item xs={12}>

                            <DialogTitle id="form-dialog-title">Get Started</DialogTitle>

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
                                />

                                <TextField
                                    margin="dense"
                                    id="password-signin"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                />

                            </DialogContent>
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button onClick={() => this.setState({ signInDialog: false })} color="black" style={{ textTransform: 'capitalize', fontSize: 18 }}>
                            Cancel
                        </Button>
                        {/*TODO: Complete the sign up functionality*/}
                        <Button onClick={() => this.setState({ signInDialog: false })} color="inherit" style={{ textTransform: 'capitalize', color: 'white', fontSize: 18, backgroundColor: 'green', padding: 10 }}>
                            Sign In
                        </Button>
                    </DialogActions>
                </Dialog>

                <Footer/>
            </div>
        )
    }
}