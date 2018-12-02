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
    const formatEnd = moment(endDate).format("MMM DD, YYYY");

    return (
      <Link to={{pathname: `/trips/${tripId}`, state: { trip: this.props.trip} }}>
        <div className="trip-item-container">
          <div className="date">{formatStart + ' - ' + formatEnd}</div>
          <div className="trip-details">
              <h3>{name}</h3>
            <div className="trip-users">
              <i className="fa fa-users"/>
              {members.join(',')}
            </div>
          </div>
        </div>
      </Link>
    )
  }
}

export default TripItem;