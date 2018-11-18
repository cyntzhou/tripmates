import React from "react";
import styles from "./create-trip.css";

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
        </form>
      </div>
    )
  }
}

export default JoinTrip;