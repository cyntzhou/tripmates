import React from "react";
import axios from "axios";
import Button from "../components/button.jsx";
import TextField from "../components/textfield.jsx";
import styles from "./settings.css";

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      errors: [],
      showSuccessMessage: false
    };
  }

  resetForm = () => {
    this.setState({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    });
  }
  
  handleChangeCurrentPassword = (event) => {
    this.setState({ currentPassword: event.target.value });
  }

  handleChangeNewPassword = (event) => {
    this.setState({ newPassword: event.target.value });
  }
  
  handleChangeConfirmNewPassword = (event) => {
    this.setState({ confirmNewPassword: event.target.value });
  }

  handleSave = () => {
    const {
      currentPassword,
      newPassword,
      confirmNewPassword
    } = this.state;
    const { 
      userId
    } = this.props;
    const errors = [];
    if (currentPassword.length === 0) {
      errors.push("Please enter your current password.");
    }
    if (newPassword.length === 0) {
      errors.push("Please enter a new password.");
    }
    if (confirmNewPassword.length === 0) {
      errors.push("Please confirm new password.");
    }
    if (newPassword !== confirmNewPassword) {
      errors.push("Passwords don't match.");
    }
    if (errors.length > 0) {
      this.setState({ 
        errors: errors,
        showSuccessMessage: false
      });
      return;
    }
    
    const bodyContent = { password: newPassword, oldPassword: currentPassword };
    axios
      .put(`/api/users/${userId}/password`, bodyContent)
      .then(res => {
        this.setState({ 
          errors: [],
          showSuccessMessage: true 
        });
        // eventBus.$emit('change-username-success', true);
      })
      .catch(err => {
        const errors = [err.response.data.error];
        this.setState({
          errors: errors,
          showSuccessMessage: false
        })
      })
      .then(() => {
        this.resetForm();
      });
  }

  render() {
    const {
      currentPassword,
      newPassword,
      confirmNewPassword,
      errors,
      showSuccessMessage
    } = this.state;

    const {
      toggleEditPassword
    } = this.props;

    return (
      <div className="settings-form">
        <div>
          <label>current password:</label>
          <TextField 
            placeholder="current password"
            value={currentPassword}
            onChange={this.handleChangeCurrentPassword}
            type={"password"}
          />
        </div>

        <div>
          <label>new password:</label>
          <TextField 
            placeholder="new password"
            value={newPassword}
            onChange={this.handleChangeNewPassword}
            type={"password"}
          />
        </div>

        <div>
          <label>confirm new password:</label>
          <TextField 
            placeholder="new password"
            value={confirmNewPassword}
            onChange={this.handleChangeConfirmNewPassword}
            type={"password"}
          />
        </div>

        {errors.length > 0 &&
          <div className="settings-error-message">
            <ul>
              {errors.map((error, i) => {
                  return <li key={i}>{error}</li>;
              })}
            </ul>
          </div>
        }

        {showSuccessMessage &&
          <div className="login-success-message">
            <b>Successfully changed password.</b>
          </div>
        }

        <div className="settings-buttons">
          <Button
            label="cancel"
            onButtonClick={toggleEditPassword}
          />
          <Button
            label="save"
            onButtonClick={this.handleSave}
          />
        </div>
      </div>
    );
  }
}

export default ChangePasswordForm;