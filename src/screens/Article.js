import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import CircularProgress from '@material-ui/core/CircularProgress';

import serverUrl from '../config';


export default class Article extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            mainMenu: null,
            articleBody: '',
            articleImage: '',
            articleLikes: null,
            articleReads: null,
            articleTitle: '',
            authorAbout: '',
            authorAvatar: null,
            authorName: '',
            error: false,
            errorMessage: 'ERR_NONE'
        }
    }

    async getArticle() {

        const articleId = this.props.match.params.articleId;

        let rawResponse = await fetch(serverUrl + `/article?articleId=${articleId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

        const content = await rawResponse.json();
        console.log(content);

        return content;

    }

    componentDidMount() {
        
        this.getArticle()
            .then((article) => {
                // Article contains the details about the article. Set these is state to use them in render
                
                const { articleBody, articleImage, articleLikes, articleReads, articleTitle, authorAbout, authorName, authorAvatar } = article;
                this.setState({ articleTitle, articleImage, articleBody, articleLikes, articleReads, authorName, authorAbout, authorAvatar, loading: false });

            })
            .catch(error => console.error(error));

    }

    render() {

        if (this.state.loading) {
            return (
                <CircularProgress color="secondary" style={{ marginLeft: '50%', marginTop: '25%'}}/>
            )
        }

        return (
            <div>
                <AppBar position="sticky" style={{ backgroundColor: 'white' }}>
                    <Toolbar>

                        <Typography variant="h6" style={{ flex: 1, color: 'black' }}>
                            Reader
                        </Typography>

                        <Avatar variant='circle' style={{ height: '40px', width: '40px' }} onClick={(event) => this.setState({ mainMenu: event.currentTarget })} />
                    </Toolbar>
                </AppBar>

                <Menu
                    id='main-menu'
                    anchorEl={this.state.mainMenu}
                    keepMounted
                    open={Boolean(this.state.mainMenu)}
                    onClose={() => this.setState({ mainMenu: false })}>
                    
                    <MenuItem onClick={() => {
                        this.setState({ mainMenu: false });
                        this.props.history.replace('/dashboard');
                    }}>
                        Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Profile</MenuItem>
                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Help</MenuItem>
                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Sign Out</MenuItem>
                </Menu>

                <div style={{ marginLeft: 300, marginRight: 300, paddingTop: 100, paddingBottom: 100 }}>
                    
                    <Typography variant='h2' style={{marginBottom: 20}}>
                        {this.state.articleTitle}
                    </Typography>

                    <Typography variant='h5' style={{ marginTop: 20 }}>
                        By {this.state.authorName}
                    </Typography>
                    
                    <img
                        src={this.state.articleImage}
                        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                    />
                        
                    {this.state.articleBody.split('\n').map((i, key) => {
                        return (
                            <div>
                                <br></br>
                                <Typography key={key}>
                                    {i}
                                </Typography>
                            </div>
                            
                        )
                    })}
                    

                </div>
            </div>
        )
    }
}