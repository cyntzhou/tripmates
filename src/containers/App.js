import React, {Component} from 'react';
import Trips from "../Frontend/trip/trips.jsx";
import Login from "../Frontend/user/login.jsx";
import Settings from "../Frontend/user/settings.jsx";
import Trip from "../Frontend/trip/trip.jsx";
import Navbar from "../Frontend/components/navbar.jsx";
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
            <Navbar/>
          </header>
          <div>
            <Route exact path="/" component={Login} />
            <Route exact path="/trips" component={Trips} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/settings" component={Settings} />
            <Route path="/trips/:id" component={Trip}/>
          </div>
        </div>
      </Router>
    )
  }
}