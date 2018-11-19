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
      showEditActivity: false,
      showCreateItinerary: false
    }
  }

  showCreateActivityModal = () => {
    this.setState({showCreateActivity: true});
  }

  showEditActivityModal = () => {
    this.setState({showEditActivity: true});
  }

  hideCreateActivityModal = () => {
    this.setState({showCreateActivity: false});
  }

  hideEditActivityModal = () => {
    this.setState({showEditActivity: false});
  }

  toggleCreateItineraryModal = () => {
    this.setState({showCreateItinerary: !this.state.showCreateItinerary});
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
            showCreateModal={this.showCreateActivityModal}
            showEditModal={this.showEditActivityModal}
          />
          <Itinerary
            toggleModal={this.toggleCreateItineraryModal}
          />
        </div>
      )
    }
  }
}

export default Trip;