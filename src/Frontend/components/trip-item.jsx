import React from "react";
import styles from "./trip-item.css";

class TripItem extends React.Component {
  render() {
    const {
      tripDate, 
      tripName, 
      tripUsers
    } = this.props;
    return (
      <div className="trip-item-container">
        <div className="date">{tripDate}</div>
        <div className="trip-details">
          <h3>{tripName}</h3>
          <div className="trip-users">
            <i className="fa fa-users"/>
            {tripUsers}
          </div>
        </div>
      </div>
    )
  }
}

export default TripItem;