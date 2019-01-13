import React, {Component} from 'react';
import axios from "axios";
import Trips from "../Frontend/trip/trips.jsx";
import Login from "../Frontend/user/login.jsx";
import Settings from "../Frontend/user/settings.jsx";
import Trip from "../Frontend/trip/trip.jsx";
import Navbar from "../Frontend/components/navbar.jsx";
import NotFound from "../Frontend/components/not-found.jsx";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Redirect, Switch } from 'react-router';
import { withCookies } from 'react-cookie';

const COOKIE_AGE = 6*60*60; // 6 hours (in seconds)

class App extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isAuthenticated: false,
    //   user: null
    // };
  }

  // Check if user is logged into session on server side. 
  // If not, delete cookie in browser
  componentDidMount() {
    const { cookies } = this.props;
    const userId = cookies.get("user-id");
    if (userId) {
      axios.get(`/api/users/${userId}/trips`).then(res => {
        // user is logged into session
      }).catch(err => {
        // 401 error because user is logged out of session
        cookies.remove("username");
        cookies.remove('user-id');
      });
    }
  }

  userHasAuthenticated = (user) => {
    const { cookies } = this.props;
    cookies.set('username', user.username, { path: '/', maxAge: COOKIE_AGE });
    cookies.set('user-id', user.id, { path: '/', maxAge: COOKIE_AGE });
  }

  logout = () => {
    const { cookies } = this.props;
    axios.post('/api/users/signout')
      .then(() => {
        cookies.remove("username");
        cookies.remove('user-id');
      })
  }

  render () {
    const { cookies } = this.props;
    const loggedIn = cookies.get("username") ? true : false;
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Navbar
              logout={this.logout}
              loggedIn={loggedIn}
            />
          </header>

          <div>
            <Switch>
              <Route exact path="/login" 
                render={(props) => <Login 
                  {...props}
                  cookies={cookies}
                  userHasAuthenticated={this.userHasAuthenticated} 
                />}
              />

              <Route exact path="/" 
                render={(props) => (
                  cookies.get("username") ? (
                    <Redirect to="/trips"/>
                  ) : (
                    <Redirect to="/login"/>
                  )
                )}
              />
              <Route exact path="/trips" 
                render={(props) => (
                  cookies.get("username") ? (
                    <Trips 
                      {...props}
                      cookies={cookies}
                    />
                  ) : (
                    <Redirect to="/login"/>
                  )
                )}
              />
              <Route exact path="/settings" 
                render={(props) => (
                  cookies.get("username") ? (
                    <Settings 
                      {...props}
                      cookies={cookies}
                    />
                  ) : (
                    <Redirect to="/login"/>
                  )
                )}
              />
              <Route path="/trips/:id"
                render={(props) => (
                  cookies.get("username") ? (
                  <Trip 
                    {...props}
                    cookies={cookies}
                  />
                  ) : (
                    <Redirect to="/login"/>
                  )
                )}
              />
              <Route component={NotFound}/>
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default withCookies(App);