import React from "react";
import styles from "./create-trip.css";

class CreateNewTrip extends React.Component {
  render() {
    return (
      <div>
        <h3>Create New Trip</h3>
        <p>Trip Name:</p>
        <p>Start Date:</p>
        <p>End Date:</p>
      </div>
    )
  }
}

export default CreateNewTrip;