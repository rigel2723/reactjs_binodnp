import React from 'react';
import './App.css';
import Home from './components/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

export default class App extends React.Component {
  render() {
    return ( <Router>
      <div>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
    )
  }
}

