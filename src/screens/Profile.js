import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import { makeStyles } from '@material-ui/core/styles';


import InputBase from '@material-ui/core/InputBase';

import Footer from '../components/Footer';


import serverUrl from '../config';

import Cookies from 'js-cookie';



export default class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            userAbout: '',
            userNameError: false,
            userNameErrorMessage: '',
            userAboutError: false,
            userAboutErrorMessage: ''
        }
        
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

        let rawResponse = await fetch(serverUrl + '/users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                id: id,
                name: this.state.userName,
                about: this.state.userAbout
            })
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
                //Set entered name in cookie
                Cookies.set('userName', this.state.userName);
                this.props.history.replace('/dashboard');
            })
            .catch(error => {
                console.error(error);
            });
    }


    profileHeading() {

        const styles = makeStyles(theme => ({
            root: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            },
            profileHeading: {
                marginTop: 80,
                marginBottom: 40,
                [theme.breakpoints.down('sm')]: {
                    marginTop: 40,
                    marginBottom: 40
                }
            },
            profileSubtitle: {
                marginTop: 20,
                marginBottom: 20
            }
        }));

        const classes = styles();

        return (
            <div className={classes.root}>
                <Typography variant="h4" align='center' className={classes.profileHeading}>
                    Your Profile
                </Typography>
                <Typography variant='body1' align='center' className={classes.profileSubtitle}>
                Setup your profile. This is how the world will see you.
                </Typography>
            </div>
        )
    }

    choicesHeading() {
        const styles = makeStyles(theme => ({
            root: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            },
            interestsHeading: {
                marginTop: 80,
                marginBottom: 40,
                [theme.breakpoints.down('sm')]: {
                    marginTop: 40,
                    marginBottom: 40
                }
            },
            interestSubheading: {
                marginTop: 20,
                marginBottom: 20
            }
        }));

        const classes = styles();

        return (
            <div className={classes.root}>
                <Typography variant='h4' className={classes.interestsHeading}>
                    Interests
                </Typography>
                <Typography varaint='body1' className={classes.interestSubheading}>
                    Select what you want to read about.
                </Typography>
            </div>
            
        )
    }

    choices() {
        const choices = ['Entertainment', 'Faishon', 'Fitness', 'Personal Finance', 'Relationships', 'Technology'];

        const styles = makeStyles(theme => ({
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 20,
                marginRight: 20,
                [theme.breakpoints.up('sm')]: {
                    marginLeft: 40,
                    marginRight: 40
                }
            },
            helperText: {
                marginTop: 20,
                marginBottom: 20,
                [theme.breakpoints.up('sm')]: {
                    marginTop: 40,
                    marginBottom: 40
                }
            }
        }));

        const classes = styles();

        return (
            <div >
                <div className={classes.root}>
                    {choices.map(choice => (
                        <Chip
                            icon={<CheckCircleOutlineIcon />}
                            label={choice}
                            style={{ margin: 10 }}
                            color='secondary'
                        />
                    ))}
                </div>
                

                <Typography variant='h5' align='center' className={classes.helperText}>
                    Select upto 5 interests
                </Typography>
            </div>
        )
    }

    componentDidMount() {
    }

    render() {
        
        return (
            <div>
                <AppBar position="sticky" style={{ backgroundColor: 'white' }}>
                    <Toolbar>

                        <Typography variant="h6" style={{ flex: 1, color: 'black' }}>
                            Reader
                        </Typography>

                        <Button color="inherit" style={{ textTransform: 'capitalize', fontSize: 18 }}>Write</Button>
                        <Button color="inherit" style={{ marginRight: 10, textTransform: 'capitalize', fontSize: 18 }} onClick={() => this.setState({ signInDialog: true })}>Sign In</Button>
                        <Button color="inherit" style={{ backgroundColor: "green", marginLeft: 10, paddingTop: 10, paddingBottom: 10, textTransform: 'capitalize', fontSize: 18 }} onClick={() => this.setState({ getStartedDialog: true })}>Get Started</Button>
                    </Toolbar>
                </AppBar>

                <this.profileHeading/>

                {/* TODO: Replace InputBase with some other textfield variant */}
                <Grid container direction="row" style={{paddingRight: 100, paddingLeft: 100}}>

                    <Grid container item xs={12} sm={6} direction="column" justify='center' alignItems='center'>
                        
                            <InputBase
                                onChange={event => this.setState({ userName: event.target.value })}
                                error={this.state.userNameError}
                                value={this.state.userName}
                                placeholder={'Full Name'}
                                fullWidth
                                style={{
                                    fontSize: 26,
                                    padding: 20,
                                    fontStyle: 'bold',
                            }}
                            inputProps={{style: {textAlign: 'center'}}}
                            />
                            <InputBase
                                onChange={event => this.setState({ userAbout: event.target.value })}
                                error={this.state.userAboutError}
                                value={this.state.userAbout}
                                placeholder={'Tell other something about you'}
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
                        
                        <Button variant='contained' color='primary' onClick={() => this.handleProfileSubmit()}>
                            Submit
                        </Button>
                        
                        {/* TODO: Button to edit profile. New screen opens */}
                    </Grid>

                    <Grid container item xs={12} sm={6} justify='center' alignItems='center' direction='column'>
                        <Avatar variant='circle' style={{ height: '160px', width: '160px' }} src={this.state.imageUrl}>
                            {/* TODO: Avatar of the user. Add icon for initial display */}
                        </Avatar>
                    </Grid>

                </Grid>

                <this.choicesHeading />
                
                <this.choices />
                
                <Footer/>
            </div>
        )
    }
}

