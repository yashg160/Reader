import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';

import Chip from '@material-ui/core/Chip';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import Input from '@material-ui/core/Input';

import Cookies from 'js-cookie';

import imageCompression from 'browser-image-compression';


import serverUrl from '../config';

export default class WriteArticle extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            mainMenu: null,
            articleMenu: null,
            tagsDialog: false,
            publishing: false,
            title: '',
            body: '',
            choices: [
                { tag: 'Entertainment', selected: false },
                { tag: 'Faishon', selected: false },
                { tag: 'Fitness', selected: false },
                { tag: 'Finance', selected: false },
                { tag: 'Relationship', selected: false },
                { tag: 'Technology', selected: false }
            ],
            selections: 0,
            encodedImage: '',
            blobImage: null
        }

        this.imageInput = null;
    }

    async validateTitle() {
        if (this.state.title.length == 0)
            throw Error('ERR_NULL_TITLE');
    }

    async validateBody() {
        if (this.state.body.length == 0)
            throw Error('ERR_NULL_BODY');
    }

    async validateChoices() {
        if (this.state.selections == 0)
            throw Error('ERR_NO_SELECTIONS');
    }



    async publishArticle() {
        //First get the cookie value with user id
        const userId = Cookies.get('userId');

        /*
        The steps followed to save the article in the database

        1. Insert the article in articles table 
        2. Get the article id and insert it into the users's wrtten articles array
        3. Insert the article id into the choices tables that the author has selected for it
        */
        

        //Get the choices that have been selected by the user
        let selectedTags = [];

        this.state.choices.map((choice) => {
            if (choice.selected)
                selectedTags.push(choice.tag.toLowerCase());
        });
        
        const rawResponse = await fetch(serverUrl + '/article/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                userId: userId,
                articleTitle: this.state.title,
                articleBody: this.state.body,
                articleTags: selectedTags,
                articleImage: this.state.encodedImage
            })
        });

        let content = await rawResponse.json();
        console.log(content);

        return content.newBlogId;
    }

    handlePublishArticle() {
        this.setState({ publishing: true });
        this.validateTitle()
            .then(() => this.validateBody())
            .then(() => this.publishArticle())
            .then((newBlogId) => {
                this.setState({ publishing: false });
                this.props.history.replace(`/articles/new/${newBlogId}`)
            })
            .catch((error) => {
                console.error(error);
                //TODO: Snackbar for errors
        })
    }

    handleChoiceClick(index) {

        if (this.state.choices[index].selected) {
            this.state.choices[index].selected = false;
            this.setState({ selections: this.state.selections - 1 });
        }
        else {
            if (this.state.selections < 3) {
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

    imageSelectHandler = event => {
        //this.getBase64(event.target.files[0]);

        console.log(event.target.files[0]);

        imageCompression.getDataUrlFromFile(event.target.files[0])
            .then(encodedImage => {
                this.setState({ encodedImage });
                console.log(encodedImage);
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

                        <Typography style={{flex: 1}}>
                            <Button variant='contained' size='small' color='primary' onClick={() => this.setState({ tagsDialog: true})}>
                                Publish
                            </Button>
                        </Typography>

                        <MoreHorizIcon fontSize='large' color='primary' style={{ marginRight: 12 }} onClick={(event) => this.setState({ articleMenu: event.currentTarget})} />

                        <Avatar variant='circle' style={{ height: '40px', width: '40px' }} onClick={(event) => this.setState({ mainMenu: event.currentTarget })} />
                    </Toolbar>
                </AppBar>

                <Menu
                    id='main-menu'
                    anchorEl={this.state.mainMenu}
                    keepMounted
                    open={Boolean(this.state.mainMenu)}
                    onClose={() => this.setState({ mainMenu: false })}>

                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Profile</MenuItem>
                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Help</MenuItem>
                    <MenuItem onClick={() => this.setState({ mainMenu: false })}>Sign Out</MenuItem>
                </Menu>

                <Menu
                    id='article-menu'
                    anchorEl={this.state.articleMenu}
                    keepMounted
                    open={Boolean(this.state.articleMenu)}
                    onClose={() => this.setState({ articleMenu: false })}>

                    <MenuItem onClick={() => {
                        this.imageInput.click();
                        this.setState({ articleMenu: false });
                    }}>
                        Change Featured Image
                        
                    </MenuItem>

                </Menu>

                <input
                    style={{ display: 'none' }}
                    type='file'
                    onChange={this.imageSelectHandler}
                    ref={imageInput => this.imageInput = imageInput}
                />

                {
                    this.state.encodedImage == '' ? 
                    
                    <div style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
                        <Typography variant='h6' align='center'>
                            No cover image selected
                        </Typography>

                        <Typography variant='body1' align='center'>
                            Here you can preview the cover image for your article. Others will see this image
                        </Typography>
                    </div>
                :
                    <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex',  marginTop: 40 }}>

                        <img
                            src={this.state.encodedImage}
                            style={{ objectFit: 'cover', width: '60%', height: 'auto' }}
                        />
                    </div>
                }

                <div style={{ marginLeft: 240, marginRight: 240, paddingTop: 40 }}>
                    
                    <Input
                        placeholder='Title'
                        style={{ fontSize: 36, marginTop: 80, marginBottom: 20 }}
                        fullWidth
                        multiline
                        rowsMax={3}
                        onChange={(event) => this.setState({title: event.target.value})}/>
                    
                    <Input
                        placeholder='Write your article'
                        style={{ fontSize: 20, marginTop: 20, marginBottom: 20 }}
                        fullWidth
                        multiline
                        onChange={(event) => this.setState({ body: event.target.value})}/>
                </div>

                <Dialog
                    open={this.state.tagsDialog}
                    onBackdropClick={(event) => console.log('Backdrop Clicked')}
                    onClose={() => this.setState({ tagsDialog: false })}
                    onExited={() => this.setState({ publishing: false })}
                    aria-labelledby="form-dialog-title"
                    style={{padding: 40}}>
                    
                    
                    <Typography variant='h5' align='center' style={{ margin: 20 }}>
                        One Last Thing
                    </Typography>
                
                
                    <Typography variant='body2' align='center' style={{ margin: 20 }}>
                        You have almost completed your article. Just one last thing. Select upto 3 tags that make it easier for viewers to find you article on Reader. Think of them as #hashtags.
                    </Typography>
                   
                    
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
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
                    </div>

                    <DialogActions>
                        <Button onClick={() => this.setState({ tagsDialog: false })} variant='text' color='default' style={{ textTransform: 'capitalize', fontSize: 18 }}>
                            Cancel
                        </Button>
                        {
                            this.state.publishing ?

                                <CircularProgress color='primary' size={24} variant="indeterminate" style={{ marginLeft: 40, marginRight: 40 }} />

                                :
                                <Button onClick={() => this.handlePublishArticle()} variant='contained' color="primary" style={{ textTransform: 'capitalize', color: 'white', fontSize: 18, padding: 10 }}>
                                    Publish
                                </Button>

                        }
                    </DialogActions>

                </Dialog>
                
            </div>
        )
    }
}