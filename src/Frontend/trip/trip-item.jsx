import React from "react";
import styles from "./trip-item.css";
import { Link } from 'react-router-dom';

class TripItem extends React.Component {
  render() {
    const {
      tripDate, 
      tripName, 
      tripUsers,
      tripId,
    } = this.props.trip;
    return (
      <div className="trip-item-container">
        <div className="date">{tripDate}</div>
        <div className="trip-details">
          <Link to={`/trips/${tripId}`}>
            <h3>{'name'}</h3>
          </Link>
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