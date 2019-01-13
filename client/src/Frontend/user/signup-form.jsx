import React from "react";
import axios from "axios";
import { Redirect } from 'react-router';
import Button from "../components/button.jsx";
import TextField from "../components/textfield.jsx";
import styles from "./signup-form.css";

class SignupForm extends React.Component {
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
    })
  }

  clearMessages = () => {
    setInterval(() => {
      this.setState({
        errors: [],
        showSuccessMessage: false
      });
    }, 5000);
  }

  handleChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  }

  handleChangePassword = (event) => {
    this.setState({ password: event.target.value });
  }

  handleSignup = (event) => {
    const {
      username,
      password
    } = this.state;

    const errors = [];
    if (username.length === 0) {
      errors.push("Please enter a username.")
    }
    if (password.length === 0) {
      errors.push("Please enter a password.")
    }
    if (errors.length > 0) {
      this.setState({ 
        errors: errors,
        showSuccessMessage: false
      });
      return;
    }

    const bodyContent = {
      username: username,
      password: password
    };
    axios
      .post("/api/users", bodyContent)
      .then((user) => {
        this.setState({
          errors: [],
          showSuccessMessage: true
        })
      })
      .catch((err) => {
        this.setState({
          errors: [err.response.data.error],
          showSuccessMessage: false
        });
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

    return (
      <div className="login-column signup-form">
      <h1>New to Tripmates?</h1>
      
      <TextField 
        placeholder="username" 
        onChange={this.handleChangeUsername}
        value={username}
        maxLength={20}
      />
      <TextField 
        placeholder="password"
        onChange={this.handleChangePassword}
        value={password}
        maxLength={60}
        type={"password"}
      />
      <div className="signup-button">
        <Button
          label="Sign Up"
          onButtonClick={this.handleSignup}
        />
      </div>

      {errors.length > 0 &&
        <div className="signup-error-message">
          <ul>
            {errors.map((error, i) => {
                return <li key={i}>{error}</li>;
            })}
          </ul>
        </div>
      }

      {showSuccessMessage &&
        <div className="signup-success-message">
          <b>Successfully created new account. Now log in!</b>
        </div>
      }

    </div>
    )
  }
}

export default SignupForm;