import React from "react";
import styles from "./trip.css";
import Activities from "../activity/activities.jsx";

class Trip extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false
    }
  }

  showModal = () => {
    this.setState({show: true});
  }

  hideModal = () => {
    this.setState({show: false});
  }

  render() {
    var tripId = this.props.match.params.id;
    return (
      <div>
        <Activities/>
        <div>Itineraries go here</div>
      </div>
    )
  }
}

export default Trip;