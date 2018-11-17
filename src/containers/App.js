import React, {Component} from 'react';
import Trip from "../Frontend/trip.jsx";
import Login from "../Frontend/login.jsx";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Home = () => (
  <div>
    Home
  </div>
)

export default class App extends Component {
  render () {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Tripmates</h1>
            <div>
              <Link to="/">
                <button>Home</button>
              </Link>
              <Link to="/trip">
                <button>Trips</button>
              </Link>
              <Link to="/login">
                <button>Login</button>
              </Link>
            </div>
          </header>
          <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/trip" component={Trip} />
            <Route exact path="/login" component={Login} />
          </div>
        </div>
      </Router>
    )
  }
}