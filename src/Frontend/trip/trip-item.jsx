import React from "react";
import moment from 'moment';
import styles from "./trip-item.css";
import { Link } from 'react-router-dom';

class TripItem extends React.Component {
  render() {
    const {
      members,
      name,
      startDate,
      endDate,
      tripId
    } = this.props.trip;
    const formatStart = moment(startDate).format("MMM DD, YYYY");
    const formatEnd = moment(startDate).format("MMM DD, YYYY");

    return (
      <div className="trip-item-container">
        <div className="date">{formatStart + ' - ' + formatEnd}</div>
        <div className="trip-details">
          <Link to={{pathname: `/trips/${tripId}`, state: { trip: this.props.trip} }}>
            <h3>{name}</h3>
          </Link>
          <div className="trip-users">
            <i className="fa fa-users"/>
            {members.join(',')}
          </div>
        </div>
      </div>
    )
  }
}

export default TripItem;