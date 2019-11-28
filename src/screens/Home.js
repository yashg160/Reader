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


export default class Home extends React.PureComponent{

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
        }
    }
    
    render() {
        return (
            <div>
                <AppBar position="sticky" style={{ backgroundColor: 'white' }}>
                    <Toolbar>

                        <Typography variant="h6" style={{ flex: 1, color: 'black' }}>
                            Reader
                        </Typography>

                        <Button color="black" style={{textTransform: 'capitalize', fontSize: 18}}>Write</Button>
                        <Button color="black" style={{ marginRight: 10, textTransform: 'capitalize', fontSize: 18}}>Sign In</Button>
                        <Button color="inherit" style={{ backgroundColor: "green", marginLeft: 10, paddingTop: 10, paddingBottom: 10, textTransform: 'capitalize', fontSize: 18}}>Get Started</Button>
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

                    <Grid item align="center" justify="center" xs={12} md={6} style={{padding: 80}}>
                        <Button variant="contained" style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 80, paddingRight: 80 }}>
                            Get Started
                        </Button>
                    </Grid>

                    <Grid item justify="flex-end" xs={12} md={6} style={{ padding: 80 }}>
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

                <Typography align="center" variant="h1" style={{ marginLeft: 80, marginRight: 80, marginTop: 20 }}>
                    Expand your mind.
                </Typography>

            </div>
        )
    }
}