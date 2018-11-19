import React, {Component} from 'react';
import axios from "axios";
import Trips from "../Frontend/trip/trips.jsx";
import Login from "../Frontend/user/login.jsx";
import Settings from "../Frontend/user/settings.jsx";
import Trip from "../Frontend/trip/trip.jsx";
import Navbar from "../Frontend/components/navbar.jsx";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Redirect } from 'react-router';

const Home = () => (
  <div>
    Home
  </div>
)
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: null
    };
  }

  userHasAuthenticated = (user) => {
    this.setState({
      isAuthenticated: true,
      user: user
    });
    console.log("User logged in");
    console.log(user);
  }

  logout = () => {
    axios.post('api/users/signout')
      .then(() => {
        this.setState({
          isAuthenticated: false,
          user: null
        })
        // eventBus.$emit('signout-success', true);
      })
  }

  render () {
    const {
      isAuthenticated,
      user
    } = this.state;

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Navbar
              logout={this.logout}
            />
          </header>

          <div>
            <Route exact path="/login" 
              render={(props) => <Login 
                {...props}
                userHasAuthenticated={this.userHasAuthenticated} 
              />}
            />

            <Route exact path="/" 
              render={(props) => (
                isAuthenticated ? (
                  <Trips 
                    {...props}
                    user={user} 
                  />
                ) : (
                  <Redirect to="/login"/>
                )
              )}
            />
            <Route exact path="/trips" 
              render={(props) => (
                isAuthenticated ? (
                  <Trips 
                    {...props}
                    user={user} 
                  />
                ) : (
                  <Redirect to="/login"/>
                )
              )}
            />
            <Route exact path="/settings" 
              render={(props) => (
                isAuthenticated ? (
                  <Settings 
                    {...props}
                    user={user} 
                  />
                ) : (
                  <Redirect to="/login"/>
                )
              )}
            />
            <Route path="/trips/:id"
              render={(props) => (
                isAuthenticated ? (
                <Trip 
                  {...props}
                  user={user} 
                />
                ) : (
                  <Redirect to="/login"/>
                )
              )}
            />
          </div>
        </div>
      </Router>
    )
  }
}