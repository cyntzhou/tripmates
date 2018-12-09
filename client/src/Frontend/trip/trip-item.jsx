import React from "react";
import moment from 'moment';
import styles from "./trip-item.css";
import { Link } from 'react-router-dom';

class TripItem extends React.Component {
  handleShare = () => {
    const { trip, toggleShareTripModal } = this.props;
    toggleShareTripModal(trip);
  }

  render() {
    const {
      toggleShareTripModal,
      trip
    } = this.props;
    const {
      members,
      name,
      startDate,
      endDate,
      tripId
    } = trip;
    const formatStart = moment(startDate).format("MMM DD, YYYY");
    const formatEnd = moment(endDate).format("MMM DD, YYYY");

    return (
        <div className="trip-item-container">
          <div className="date">
            <div id="date">
              {formatStart + ' - ' + formatEnd}
            </div>
          </div>
          <Link to={{pathname: `/trips/${tripId}`, state: { trip: this.props.trip} }}>
          <div className="trip-details">
            <h3>{name}</h3>
            <div className="trip-users">
              <i className="fa fa-users"/>
              {members.join(',')}
            </div>
          </div>
          </Link>
          <div
            className="share"
            onClick={this.handleShare}
          >
            <i className="fa fa-share"/>
          </div>
        </div>
    )
  }
}

export default TripItem;