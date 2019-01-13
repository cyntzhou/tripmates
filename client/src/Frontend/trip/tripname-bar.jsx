import React from "react";
import styles from "./tripname-bar.css";
import { Link } from 'react-router-dom';

class TripnameBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { 
      toggleEditTripModal,
      tripName
    } = this.props;
    return (
      <div className="tripname-bar">
        {tripName}
        <i onClick={toggleEditTripModal} className="fa fa-edit"/>
      </div>
    )
  }
}

export default TripnameBar;