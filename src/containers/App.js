import React, {Component} from 'react';
import axios from "axios";
import Trips from "../Frontend/trip/trips.jsx";
import Login from "../Frontend/user/login.jsx";
import Settings from "../Frontend/user/settings.jsx";
import Trip from "../Frontend/trip/trip.jsx";
import Navbar from "../Frontend/components/navbar.jsx";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { withCookies } from 'react-cookie';

class App extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isAuthenticated: false,
    //   user: null
    // };
  }

  userHasAuthenticated = (user) => {
    const { cookies } = this.props;
    cookies.set('username', user.username, { path: '/' });
    cookies.set('user-id', user.id, { path: "/" });
    console.log("User logged in");
    console.log(user);
  }

  logout = () => {
    const { cookies } = this.props;
    axios.post('/api/users/signout')
      .then(() => {
        cookies.remove("username");
        cookies.remove('user-id');
        // eventBus.$emit('signout-success', true);
      })
  }

  render () {
    const { cookies } = this.props;

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
          </div>
        </div>
      </Router>
    )
  }
}

export default withCookies(App);