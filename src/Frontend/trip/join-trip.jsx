import React from "react";
import styles from "./create-trip.css";
import Button from "../components/button.jsx";

class JoinTrip extends React.Component {
  constructor() {
    super();
    this.state = {
      codeValue: ''
    }
  }

  onChange(event) {
    this.setState = ({
      codeValue: event.target.value
    });
  }

  render() {
    return (
      <div className="form-container">
        <h3>Join Trip</h3>
        <form>
          <input type="text" name="codeValue" onChange={this.onChange}/>
          <Button label="Cancel" onButtonClick={this.props.hideModal}/>
        </form>
      </div>
    )
  }
}

export default JoinTrip;