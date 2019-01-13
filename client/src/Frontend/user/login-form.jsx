import React from "react";
import axios from "axios";
import { Redirect } from 'react-router';
import Button from "../components/button.jsx";
import TextField from "../components/textfield.jsx";
import styles from "./login-form.css";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: []
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
        errors: []
      });
    }, 5000);
  }

  handleChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  }

  handleChangePassword = (event) => {
    this.setState({ password: event.target.value });
  }

  handleLogin = (event) => {
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
        errors: errors
      });
      return;
    }

    const bodyContent = {
      username: username,
      password: password
    };
    axios
      .post("/api/users/signin", bodyContent)
      .then((res) => {
        this.props.userHasAuthenticated(res.data);
        this.props.redirectToHomepage();
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          errors: [err.response.data.error]
        });
      })
  }

  render() {
    const {
      username,
      password,
      errors
    } = this.state;

    return (
      <div className="login-column login-form">
        <h1>Log in to your account</h1>
        <TextField 
          placeholder="username" 
          onChange={this.handleChangeUsername}
          value={username}
        />
        <TextField 
          placeholder="password"
          onChange={this.handleChangePassword}
          value={password}
          type={"password"}
        />
        <div className="login-button">
          <Button
            colorClassName="btn-yellow-background"
            label="Log In"
            onButtonClick={this.handleLogin}
          />
        </div>

        {errors.length > 0 &&
          <div className="login-error-message">
            <ul>
              {errors.map((error, i) => {
                  return <li key={i}>{error}</li>;
              })}
            </ul>
          </div>
        }
      </div>
    )
  }
}

export default LoginForm;