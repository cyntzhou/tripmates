import React from "react";
import styles from "./trip.css";
import Activities from "../activity/activities.jsx";
import Itinerary from "../itinerary/itinerary.jsx";
import CreateActivityModal from "../activity/create-activity-modal.jsx";
import CreateItineraryModal from "../itinerary/create-itinerary-modal.jsx";
import EditItineraryModal from "../itinerary/edit-itinerary-modal.jsx";
import EditActivityModal from "../activity/edit-activity-modal.jsx";
import EditTripModal from "./edit-trip-modal.jsx";

class Trip extends React.Component {
  constructor() {
    super();
    this.state = {
      showCreateActivity: false,
      showEditActivity: false,
      showEditTrip: false,
      showCreateItinerary: false,
      showEditItinerary: false
    }
  }

  toggleCreateActivityModal = () => {
    this.setState({showCreateActivity: !this.state.showCreateActivity});
  }
  toggleEditActivityModal = () => {
    this.setState({showEditActivity: !this.state.showEditActivity});
  }
  toggleEditTripModal = () => {
    this.setState({showEditTrip: !this.state.showEditTrip});
  }
  toggleCreateItineraryModal = () => {
    this.setState({showCreateItinerary: !this.state.showCreateItinerary});
  }
  toggleEditItineraryModal = () => {
    this.setState({showEditItinerary: !this.state.showEditItinerary});
  }

  render() {
    var trip = this.props.location.state.trip
    if (this.state.showCreateActivity) {
      return (
        <CreateActivityModal 
          hideCreateModal={this.toggleCreateActivityModal}
          tripId={trip.tripId}
        />
      )
    } else if (this.state.showEditActivity) {
      return (
        <EditActivityModal hideEditModal={this.toggleEditActivityModal} tripId={trip.tripId}/>
      )
    } else if (this.state.showEditTrip) {
      return (
        <EditTripModal 
          hideModal={this.toggleEditTripModal}
          trip={trip}
        />
      )
    } else {
      return (
        <div className="trip-container">
          <div className="edit-trip">
            <p>Click to edit trip: </p>
            <i onClick={this.toggleEditTripModal} className="fa fa-edit"/>
          </div>
          <Activities 
            showCreateModal={this.toggleCreateActivityModal}
            showEditModal={this.toggleEditActivityModal}
            tripId={trip.tripId}
          />
          <Itinerary
            toggleCreateModal={this.toggleCreateItineraryModal}
            toggleEditModal={this.toggleEditItineraryModal}
          />

          <CreateItineraryModal
            showModal={this.state.showCreateItinerary}
            toggleModal={this.toggleCreateItineraryModal}
            tripId={trip.tripId}
          />

          <EditItineraryModal
            showModal={this.state.showEditItinerary}
            toggleModal={this.toggleEditItineraryModal}
          />
        </div>
      )
    }
  }
}

export default Trip;