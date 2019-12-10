import React from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';


export default class Footer extends React.PureComponent {

    render() {
        return (
            <div style={{marginTop: 100}}>
                
                <Divider variant="middle"/>
                
                <Typography align="center" variant="body1" style={{marginTop: 40, marginBottom: 40}}>
                    Reader blog app. Created by Yash Gupta November 2019.
                </Typography>
            </div>
        )
    }
}