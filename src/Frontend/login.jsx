import React from "react";
import Button from "./components/button.jsx";
// import styles from "./login.css"

class Login extends React.Component {
  render() {
    return (
      <div>
        <div>
          <h1>Log in to your account</h1>
          <Button
            colorClassName="btn-yellow-background"
            label="Log In"
          />
        </div>
      </div>
    )
  }
}

export default Login;