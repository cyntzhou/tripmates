import React from "react";
import axios from "axios";
import { Redirect } from 'react-router';
import Button from "../components/button.jsx";
import LoginForm from "./login-form.jsx";
import SignupForm from "./signup-form.jsx";
import styles from "./login.css";

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