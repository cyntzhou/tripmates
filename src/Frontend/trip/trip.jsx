import React from "react";
import styles from "./trip.css";
import Activities from "../activity/activities.jsx";
import Itinerary from "../itinerary/itinerary.jsx";
import CreateActivityModal from "../activity/create-activity-modal.jsx";
import EditActivityModal from "../activity/edit-activity-modal.jsx";
import EditTripModal from "./edit-trip-modal.jsx";

class Trip extends React.Component {
  constructor() {
    super();
    this.state = {
      showCreateActivity: false,
      showEditActivity: false,
      showEditTrip: false
    }
  }

  showCreateModal = () => {
    this.setState({showCreateActivity: true});
  }

  showEditModal = () => {
    this.setState({showEditActivity: true});
  }

  showEditTripModal = () => {
    this.setState({showEditTrip: true});
  }

  hideCreateModal = () => {
    this.setState({showCreateActivity: false});
  }

  hideEditModal = () => {
    this.setState({showEditActivity: false});
  }

  hideEditTripModal = () => {
    this.setState({showEditTrip: false});
  }

  render() {
    var tripId = this.props.match.params.id;
    if (this.state.showCreateActivity) {
      return (
        <CreateActivityModal hideCreateModal={this.hideCreateModal}/>
      )
    } else if (this.state.showEditActivity) {
      return (
        <EditActivityModal hideEditModal={this.hideEditModal} tripId={tripId}/>
      )
    } else if (this.state.showEditTrip) {
      return (
        <EditTripModal hideModal={this.hideEditTripModal}/>
      )
    } else {
      return (
        <div className="trip-container">
          <div className="edit-trip">
            <p>Click to edit trip: </p>
            <i onClick={this.showEditTripModal} className="fa fa-edit"/>
          </div>
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