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
            userAboutErrorMessage: '',
            choices: [
                { tag: 'Entertainment', selected: false },
                { tag: 'Faishon', selected: false },
                { tag: 'Fitness', selected: false },
                { tag: 'Finance', selected: false },
                { tag: 'Relationships', selected: false},
                { tag: 'Technology', selected: false}
            ],
            selections: 0
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

        //Get the choices that have been selected by the user
        let selectedChoices = [];

        this.state.choices.map((choice) => {
            if (choice.selected)
                selectedChoices.push(choice.tag.toLowerCase());
        });

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
                about: this.state.userAbout,
                choices: selectedChoices
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
                //TODO: Profile has been successfully created. Move to the dashboa
                //TODO: Add Cookies for the choices selected
                //Set entered name in cookie
                Cookies.set('userName', this.state.userName);
                this.props.history.replace('/dashboard');
            })
            .catch(error => {
                //TODO: Add Snackbar for error
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

    handleChoiceClick(index) {

        if (this.state.choices[index].selected) {
            this.state.choices[index].selected = false;
            this.setState({ selections: this.state.selections - 1 });
        }
        else {
            if (this.state.selections < 5) {
                this.state.choices[index].selected = true;
                this.setState({ selections: this.state.selections + 1 });
            }
            else {
                //TODO: Add snackbar to notify user of full choices
                console.log('Full');
            }
        }
        this.forceUpdate();
    }

    componentDidMount() {
    }

    render() {
        
        return (
            <div>
                <AppBar position="sticky" style={{ backgroundColor: 'white' }}>
                    <Toolbar>

                        <Typography variant="h6" style={{ flex: 1, color: 'black' }} onClick={() => this.props.history.push('/dashboard')}>
                            Reader
                        </Typography>

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
                        
                        {/* TODO: Button to edit profile. New screen opens */}
                    </Grid>

                    <Grid container item xs={12} sm={6} justify='center' alignItems='center' direction='column'>
                        <Avatar variant='circle' style={{ height: '160px', width: '160px' }} src={this.state.imageUrl}>
                            {/* TODO: Avatar of the user. Add icon for initial display */}
                        </Avatar>
                    </Grid>

                </Grid>

                <this.choicesHeading />
                
                <div >
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
                        <Chip
                            icon={<CheckCircleOutlineIcon />}
                            label={this.state.choices[0].tag}
                            style={{ margin: 10, padding: 20 }}
                            clickable
                            onClick={() => this.handleChoiceClick(0)}
                            color={this.state.choices[0].selected ? 'secondary' : 'default'}
                        />
                        <Chip
                            icon={<CheckCircleOutlineIcon />}
                            label={this.state.choices[1].tag}
                            style={{ margin: 10, padding: 20 }}
                            clickable
                            onClick={() => this.handleChoiceClick(1)}
                            color={this.state.choices[1].selected ? 'secondary' : 'default'}
                        />
                        <Chip
                            icon={<CheckCircleOutlineIcon />}
                            label={this.state.choices[2].tag}
                            style={{ margin: 10, padding: 20 }}
                            clickable
                            onClick={() => this.handleChoiceClick(2)}
                            color={this.state.choices[2].selected ? 'secondary' : 'default'}
                        />
                        <Chip
                            icon={<CheckCircleOutlineIcon />}
                            label={this.state.choices[3].tag}
                            style={{ margin: 10, padding: 20 }}
                            clickable
                            onClick={() => this.handleChoiceClick(3)}
                            color={this.state.choices[3].selected ? 'secondary' : 'default'}
                        />
                        <Chip
                            icon={<CheckCircleOutlineIcon />}
                            label={this.state.choices[4].tag}
                            style={{ margin: 10, padding: 20 }}
                            clickable
                            onClick={() => this.handleChoiceClick(4)}
                            color={this.state.choices[4].selected ? 'secondary' : 'default'}
                        />
                        <Chip
                            icon={<CheckCircleOutlineIcon />}
                            label={this.state.choices[5].tag}
                            style={{ margin: 10, padding: 20 }}
                            clickable
                            onClick={() => this.handleChoiceClick(5)}
                            color={this.state.choices[5].selected ? 'secondary' : 'default'}
                        />
                    </div>

                    <Typography variant='h5' align='center' style={{marginTop: 40}}>
                        Select upto 5 interests
                    </Typography>

                </div>

                <Typography align='center'>
                    <Button variant='contained' size='large' align='center' color='primary' onClick={() => this.handleProfileSubmit()} style={{ marginTop: 80, paddingLeft: 80, paddingRight: 80 }}>
                        Submit
                    </Button>
                </Typography>
                
                <Footer/>
            </div>
        )
    }
}
