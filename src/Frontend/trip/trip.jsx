import React from "react";
import axios from "axios";
import styles from "./trip.css";
import Activities from "../activity/activities.jsx";
import Itinerary from "../itinerary/itinerary.jsx";
import CreateActivityModal from "../activity/create-activity-modal.jsx";
import CreateItineraryModal from "../itinerary/create-itinerary-modal.jsx";
import EditItineraryModal from "../itinerary/edit-itinerary-modal.jsx";
import CreateEventModal from "../itinerary/create-event-modal.jsx";
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
      showCreateEvent: false,
      showEditEvent: false,
      activities: [],
      itineraries: [],
      itinerary: null,
      createEventStart: "",
      createEventEnd: "",
      existingEvents: []
    }
  }

  componentDidMount() {
    this.getItineraries();
    this.getActivities();
  }

  getItineraries = (itinerary) => {
    const tripId = this.props.match.params.id;
    axios.get(`/api/trips/${tripId}/itineraries`).then(res => {
      console.log('itineraries', res.data);
      const newState = {
        itineraries: res.data
      }
      if (res.data.length > 0 && !itinerary) {
        newState["itinerary"] = res.data[0];
      } else {
        newState["itinerary"] = itinerary;
      }

      if (newState["itinerary"] !== null) {
        this.getEvents(newState["itinerary"]).then(() => {
          this.setState(newState);
        });
      } else {
        // TODO: allow a default itinerary?
        this.setState(newState);
        console.log(this.state);
      }
    });
  }

  getEvents = (itinerary) => {
    return axios.get(`/api/itineraries/${itinerary.id}/events`).then(res => {
      console.log('events', res.data); // TODO not showing new event?
      const existingEvents = res.data.map((event) => {
        const activities = [ // TODO: for now 
          {
            name: "Hiking",
            id: 1
          },{
            name: "Dim sum",
            id: 2
          }
        ];
        // const activity = this.state.activities.filter(activity => activity.id === event.activityId);
        const activity = activities.filter(activity => activity.id === event.activityId)[0];
        return {
          start: event.startDateTime.replace(" ", "T"),
          end: event.endDateTime.replace(" ", "T"),
          title: activity.name
        }
      });
      this.setState({ existingEvents: existingEvents });
      console.log(this.state);
    });
  }

  getActivities = () => {
    const tripId = this.props.match.params.id;
    axios.get(`/api/activities/trip/${tripId}`).then(res => {
      this.setState({ activities: res.data });
      console.log(res.data);
    });
  }

  handleSelectItinerary = (itinerary) => {
    return () => this.setState({ itinerary: itinerary });
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
  toggleCreateEventModal = (start, end) => {
    console.log(start);
    this.setState({
      createEventStart: start,
      createEventEnd: end,
      showCreateEvent: !this.state.showCreateEvent
    });
  }
  toggleEditEventModal = () => {
    this.setState({showEditEvent: !this.state.showEditEvent});
  }

  editItinerariesDone = (itinerary) => {
    this.getItineraries(itinerary);
  }

  editEventsDone = () => {
    this.getEvents(this.state.itinerary);
  }

  render() {
    var trip = this.props.location.state.trip
    var tripId = this.props.match.params.id;

    const {
      // activities,
      itineraries,
      itinerary,
      existingEvents,
      showCreateActivity,
      showEditActivity,
      showEditTrip,
      showCreateItinerary,
      showEditItinerary,
      showCreateEvent,
      showEditEvent,
      createEventEnd,
      createEventStart
    } = this.state;

    // for now
    const activities = [
      {
        name: "Hiking",
        id: 1
      },{
        name: "Dim sum",
        id: 2
      }
    ];

    if (showCreateActivity) {
      return (
        <CreateActivityModal hideCreateModal={this.toggleCreateActivityModal}/>
      )
    } else if (showEditActivity) {
      return (
        <EditActivityModal hideEditModal={this.toggleEditActivityModal} tripId={tripId}/>
      )
    } else if (showEditTrip) {
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
            toggleCreateItineraryModal={this.toggleCreateItineraryModal}
            toggleEditItineraryModal={this.toggleEditItineraryModal}
            toggleCreateEventModal={this.toggleCreateEventModal}
            itinerary={itinerary}
            itineraries={itineraries}
            existingEvents={existingEvents}
            handleSelectItinerary={this.handleSelectItinerary}
          />

          <CreateItineraryModal
            showModal={showCreateItinerary}
            toggleModal={this.toggleCreateItineraryModal}
            tripId={tripId}
            editItinerariesDone={this.editItinerariesDone}
          />

          <EditItineraryModal
            showModal={showEditItinerary}
            toggleModal={this.toggleEditItineraryModal}
            itinerary={itinerary}
            editItinerariesDone={this.editItinerariesDone}
          />

          <CreateEventModal
            showModal={showCreateEvent}
            toggleModal={this.toggleCreateEventModal}
            itinerary={itinerary}
            start={createEventStart}
            end={createEventEnd}
            editEventsDone={this.editEventsDone}
            activities={activities}
          />
        </div>
      )
    }
  }
}

export default Trip;