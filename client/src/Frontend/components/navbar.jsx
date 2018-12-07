import React from "react";
import styles from "./navbar.css";
import { Link } from 'react-router-dom';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showUserDropdown: false };
  }

  toggleUserDropdown = () => {
    this.setState(previousState => (
      { showUserDropdown: !previousState.showUserDropdown }
    ));
  }

  handleLogout = () => {
    this.props.logout();
    // this.props.history.push("/");
  }

  render() {
    const {showUserDropdown} = this.state;
    const {loggedIn} = this.props;
    return (
      <div>
        <ul className="navbar-ul">
          {/* <li className="navbar-li"><a href="/">Tripmates</a></li> */}
          <li className="navbar-li">
            <Link to="/">
              Tripmates
            </Link>
          </li>
          <li className="navbar-li">
            {loggedIn &&
              <a href="#" className="user-dropdown"
                onMouseEnter={this.toggleUserDropdown}
                onMouseLeave={this.toggleUserDropdown}
              >
                <i className="fa fa-user-circle fa-2x"/>
              </a>
            }
          </li>
        </ul>

        {showUserDropdown && loggedIn &&
          <div className="user-dropdown-content"
            onMouseEnter={this.toggleUserDropdown}
            onMouseLeave={this.toggleUserDropdown}
          >
            <Link to="/trips">
              My Trips
            </Link>
            <Link to="/settings">
              Settings
            </Link>
            <a onClick={this.handleLogout}>Logout</a>
          </div>
        }

      </div>
    )
  }
}

export default Navbar;
