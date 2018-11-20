import React from "react";
import axios from "axios";
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
      showEditItinerary: false,
      itineraries: [],
      itinerary: null
    }
  }

  componentDidMount() {
    this.getItineraries();
  }

  getItineraries = (itinerary) => {
    const tripId = this.props.match.params.id;
    axios.get(`/api/trips/${tripId}/itineraries`).then(res => {
      console.log('itineraries', res);
      const newState = {
        itineraries: res.data
      }
      if (res.data.length > 0 && !itinerary) {
        newState["itinerary"] = res.data[0];
      } else {
        newState["itinerary"] = itinerary;
      }
      console.log(newState);
      // TODO: allow a default itinerary?
      // TODO: if no itineraries
      this.setState(newState);
    })
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

  editItinerariesDone = (itinerary) => {
    this.getItineraries(itinerary);
  }

  render() {
    var trip = this.props.location.state.trip
    var tripId = this.props.match.params.id;

    // for now
    const {
      itineraries,
      itinerary
    } = this.state;

    if (this.state.showCreateActivity) {
      return (
        <CreateActivityModal hideCreateModal={this.toggleCreateActivityModal}/>
      )
    } else if (this.state.showEditActivity) {
      return (
        <EditActivityModal hideEditModal={this.toggleEditActivityModal} tripId={tripId}/>
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
            tripId={tripId}
          />
          <Itinerary
            toggleCreateModal={this.toggleCreateItineraryModal}
            toggleEditModal={this.toggleEditItineraryModal}
            itinerary={itinerary}
            itineraries={itineraries}
          />

          <CreateItineraryModal
            showModal={this.state.showCreateItinerary}
            toggleModal={this.toggleCreateItineraryModal}
            tripId={tripId}
            editItinerariesDone={this.editItinerariesDone}
          />

          <EditItineraryModal
            showModal={this.state.showEditItinerary}
            toggleModal={this.toggleEditItineraryModal}
            itinerary={itinerary}
            editItinerariesDone={this.editItinerariesDone}
          />
        </div>
      )
    }
  }
}

export default Trip;