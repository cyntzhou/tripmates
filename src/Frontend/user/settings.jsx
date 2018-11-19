import React from "react";
import Button from "../components/button.jsx";
import TextField from "../components/textfield.jsx";
import ChangeUsernameForm from "./change-username-form.jsx";
import ChangePasswordForm from "./change-password-form.jsx";
import styles from "./settings.css";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      showEditUsername: false,
      showEditPassword: false
    };
  }
  
  toggleEditUsername = () => {
    this.setState(previousState => (
      { showEditUsername: !previousState.showEditUsername }
    ));
  }

  toggleEditPassword = () => {
    this.setState(previousState => (
      { showEditPassword: !previousState.showEditPassword }
    ));
  }

  render() {
    const {
      showEditPassword,
      showEditUsername
    } = this.state;

    const { cookies } = this.props;

    const username = "JuiCy buNS";
    const password = "ilove6170";

    return (
      <div className="settings">
        <h1>User Settings</h1>
        <div>
          Username: {username} <i onClick={this.toggleEditUsername} className="fa fa-edit"/>
        </div>
        {showEditUsername &&
          <ChangeUsernameForm 
            toggleEditUsername={this.toggleEditUsername}
            userId={cookies.get("user-id")}
          />
        }
        <div>
          Password: {password} <i onClick={this.toggleEditPassword} className="fa fa-edit"/>
        </div>
        {showEditPassword &&
          <ChangePasswordForm
            toggleEditPassword={this.toggleEditPassword}
            userId={cookies.get("user-id")}
          />
        }
      </div>
    )
  }
}

export default Settings;