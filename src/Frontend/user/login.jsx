import React from "react";
import axios from "axios";
import { Redirect } from 'react-router';
import Button from "../components/button.jsx";
import styles from "./login.css";

const TextField = (props) => (
  <input 
    className="login-form-textfield" 
    type="text" 
    placeholder={props.placeholder}
    onChange={props.onChange}
    value={props.value}
  />
);

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
        // eventBus.$emit("create-account-success", user);
      })
      .catch((err) => {
        this.setState({
          errors: [err.response.data.error],
          showSuccessMessage: false
        });
      })
      .then(() => {
        this.resetForm();
        // this.clearMessages();
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
      />
      <TextField 
        placeholder="password"
        onChange={this.handleChangePassword}
        value={password}
      />
      <div className="login-button">
        <Button
          label="Sign Up"
          onButtonClick={this.handleSignup}
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

      {showSuccessMessage &&
        <div className="login-success-message">
          <b>Successfully created new account. Now log in!</b>
        </div>
      }

    </div>
    )
  }
}

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
        // eventBus.$emit("sigin-success", res.data);
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

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  redirectToHomepage = () => {
    console.log(this.props);
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="login">
        <h2>Tripmates</h2>
        <div className="login-forms">
          <LoginForm
            userHasAuthenticated={this.props.userHasAuthenticated}
            redirectToHomepage={this.redirectToHomepage}
          />
          <SignupForm/>
        </div>
      </div>
    )
  }
}

export default Login;