import React from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';


export default class Footer extends React.PureComponent {

    render() {
        return (
            <div>
                
                <Divider variant="middle" style={{ marginBottom: 10 }} />
                
                <Typography align="center" variant="body1">
                    Reader blog app. Created by Yash Gupta November 2019.
                </Typography>

                <Typography align="center" variant="body1">
                    Navigate
                </Typography>

                {/* TODO: Setup links for navigation */}
                <Grid container direction="row" alignItems="center" justify="center" spacing={2}>
                    <Grid item>
                        <Link href='/' color="inherit" variant="inherit">
                            Home
                        </Link>
                    </Grid>
                </Grid>
                <Divider style={{ marginTop: 10 }} />
            </div>
        )
    }
}