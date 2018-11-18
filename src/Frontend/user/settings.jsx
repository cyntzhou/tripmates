import React from "react";
import Button from "../components/button.jsx";
import styles from "./settings.css";

const TextField = (props) => (
  <input className="login-form-textfield" type="text" placeholder={props.placeholder}/>
);

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      showEditUsername: false,
      showEditPassword: false
    };
  }
  
  UsernameForm = () => (
    <div className="settings-form">
      <div>
        <label>new username:</label>
        <TextField placeholder="new username"/>
      </div>
      <div>
      <label>confirm password:</label>
      <TextField placeholder="password"/>
      </div>
      <div>
        <Button
          label="cancel"
          onButtonClick={this.toggleEditUsername}
        />
        <Button
          label="save"
        />
      </div>
    </div>
  );

  PasswordForm = () => (
    <div className="settings-form">
      <div>
        <label>current password:</label>
        <TextField placeholder="current password"/>
      </div>
      <div>
        <label>new password:</label>
        <TextField placeholder="new password"/>
      </div>
      <div>
        <label>confirm new password:</label>
        <TextField placeholder="new password"/>
      </div>
      <div>
        <Button
          label="cancel"
          onButtonClick={this.toggleEditPassword}
        />
        <Button
          label="save"
        />
      </div>
    </div>
  );

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

    const username = "JuiCy buNS";
    const password = "ilove6170";

    return (
      <div className="settings">
        <h1>User Settings</h1>
        <div>
          Username: {username} <i onClick={this.toggleEditUsername} className="fa fa-edit"/>
        </div>
        {showEditUsername &&
          <this.UsernameForm/>
        }
        <div>
          Password: {password} <i onClick={this.toggleEditPassword} className="fa fa-edit"/>
        </div>
        {showEditPassword &&
          <this.PasswordForm/>
        }
      </div>
    )
  }
}

export default Settings;