import React from "react";
import styles from "./trip.css";
import Activities from "../activity/activities.jsx";
import Itinerary from "../itinerary/itinerary.jsx";
import CreateActivityModal from "../activity/create-activity-modal.jsx";
import EditActivityModal from "../activity/edit-activity-modal.jsx";

class Trip extends React.Component {
  constructor() {
    super();
    this.state = {
      showCreateActivity: false,
      showEditActivity: false
    }
  }

  showCreateModal = () => {
    this.setState({showCreateActivity: true});
  }

  showEditModal = () => {
    this.setState({showEditActivity: true});
  }

  hideCreateModal = () => {
    this.setState({showCreateActivity: false});
  }

  hideEditModal = () => {
    this.setState({showEditActivity: false});
  }

  render() {
    var tripId = this.props.match.params.id;
    if (this.state.showCreateActivity) {
      return (
        <CreateActivityModal hideCreateModal={this.hideCreateModal}/>
      )
    } else if (this.state.showEditActivity) {
      return (
        <EditActivityModal hideEditModal={this.hideEditModal}/>
      )
    } else {
      return (
        <div className="trip-container">
          <Activities 
            showCreateModal={this.showCreateModal}
            showEditModal={this.showEditModal}
          />
          <Itinerary/>
        </div>
      )
    }
  }
}

export default Trip;