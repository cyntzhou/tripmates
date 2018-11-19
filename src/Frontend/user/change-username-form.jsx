import React from "react";
import axios from "axios";
import Button from "../components/button.jsx";
import TextField from "../components/textfield.jsx";
import styles from "./settings.css";

class ChangeUsernameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      username: "",
      password: "",
      errors: [],
      showSuccessMessage: false
    };
  }

  resetForm = () => {
    this.setState({
      username: "",
      password: ""
    });
  }
  
  handleChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  }
  
  handleChangePassword = (event) => {
    this.setState({ password: event.target.value });
  }

  handleSave = () => {
    const {
      username,
      password
    } = this.state;
    const { 
      userId
    } = this.props;
    const errors = [];
    if (username.length === 0) {
      errors.push("Please enter a new username.");
    }
    if (password.length === 0) {
      errors.push("Please enter a password.");
    }
    if (errors.length > 0) {
      this.setState({ 
        errors: errors,
        showSuccessMessage: false
      });
      return;
    }
    
    const bodyContent = { username: username };
    axios
      .put(`/api/users/${userId}/username`, bodyContent)
      .then(res => {
        this.setState({ showSuccessMessage: true });
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
      username,
      password,
      errors,
      showSuccessMessage
    } = this.state;

    const {
      toggleEditUsername
    } = this.props;

    return (
      <div className="settings-form">
        <div>
          <label>new username:</label>
          <TextField 
            placeholder="new username"
            value={username}
            onChange={this.handleChangeUsername}
          />
        </div>

        <div>
          <label>confirm password:</label>
          <TextField 
            placeholder="password"
            value={password}
            onChange={this.handleChangePassword}
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
            <b>Successfully changed username.</b>
          </div>
        }

        <div className="settings-buttons">
          <Button
            label="cancel"
            onButtonClick={toggleEditUsername}
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

export default ChangeUsernameForm;