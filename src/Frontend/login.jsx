import React from "react";
import Button from "./components/button.jsx";
import styles from "./login.css";

const TextField = (props) => (
  <input className="login-form-textfield" type="text" placeholder={props.placeholder}/>
);

const SignupForm = () => (
  <div className="column signup-form">
    <h1>New to Tripmates?</h1>
    <TextField placeholder="username"/>
    <TextField placeholder="password"/>
    <div className="login-button">
      <Button
        label="Sign Up"
      />
    </div>
  </div>
);

const LoginForm = () => (
  <div className="column login-form">
    <h1>Log in to your account</h1>
    <TextField placeholder="username"/>
    <TextField placeholder="password"/>
    <div className="login-button">
      <Button
        colorClassName="btn-yellow-background"
        label="Log In"
      />
    </div>
  </div>
);

class Login extends React.Component {
  render() {
    return (
      <div className="row">
        <LoginForm/>
        <SignupForm/>
      </div>
    )
  }
}

export default Login;