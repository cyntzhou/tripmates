import React from "react";
import AddButton from "./components/add-button.jsx";
import styles from "./trip.css"


class Trip extends React.Component {
  render() {
    return (
      <div>
        <div>Trip UI</div>
        <div className="trip-header">
          <h1>My Trips</h1>
          <AddButton/>
        </div>
      </div>
    )
  }
}

export default Trip;