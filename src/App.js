import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';



import Home from './screens/Home';
import Dashboard from './screens/Dashboard';
import Profile from './screens/Profile';

export default class App extends React.PureComponent {
  render() {
    

    return (
        <Router>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/profile" component={Profile} />
              <Route path="/" component={Home} />
            </Switch>
        </Router>
      
    )
  }
}
