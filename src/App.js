import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';



import Home from './screens/Home';
import Dashboard from './screens/Dashboard';
import Profile from './screens/Profile';
import WriteArticle from './screens/WriteArticle';
import Article from './screens/Article';
import EditProfile from './screens/EditProfile';
import User from './screens/User';

export default class App extends React.PureComponent {
  render() {
    

    return (
        <Router>
            <Switch>
              {/* <Route path="/dashboard" component={Dashboard} />
              <Route path="/editProfile" component={EditProfile} />
              <Route path="/profile" component={Profile} />
              <Route path="/writeArticle" component={WriteArticle} />
              <Route path="/articles/:articleId" component={Article} />
              <Route path="/users/:userId" component={User} /> */}
              <Route path="/" component={Home} />
            </Switch>
        </Router>
      
    )
  }
}
