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

  usernameChanged = (username) => {
    this.props.cookies.set("username", username);
  }

  render() {
    const {
      showEditPassword,
      showEditUsername
    } = this.state;

    const { cookies } = this.props;

    return (
      <div className="settings">
        <h1>User Settings</h1>
        <div>
          Username: {cookies.get("username")} <i onClick={this.toggleEditUsername} className="fa fa-edit"/>
        </div>
        {showEditUsername &&
          <ChangeUsernameForm 
            toggleEditUsername={this.toggleEditUsername}
            userId={cookies.get("user-id")}
            usernameChanged={this.usernameChanged}
          />
        }
        <div>
          Password: ******** <i onClick={this.toggleEditPassword} className="fa fa-edit"/>
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