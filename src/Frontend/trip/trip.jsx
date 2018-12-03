import React from "react";
import axios from "axios";
import styles from "./trip.css";
import Activities from "../activity/activities.jsx";
import Itinerary from "../itinerary/itinerary.jsx";
import CreateActivityModal from "../activity/create-activity-modal.jsx";
import CreateItineraryModal from "../itinerary/create-itinerary-modal.jsx";
import EditItineraryModal from "../itinerary/edit-itinerary-modal.jsx";
import CreateEventModal from "../itinerary/create-event-modal.jsx";
import EditEventModal from "../itinerary/edit-event-modal.jsx";
import EditActivityModal from "../activity/edit-activity-modal.jsx";
import EditTripModal from "./edit-trip-modal.jsx";
import TripnameBar from "./tripname-bar.jsx";
import { formatDate } from "../utils.js";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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
      activityToEdit: null,
      createEventStart: "",
      createEventEnd: "",
      existingEvents: [],
      selectedEvent: null,
      tripName: ""
    }
  }

  componentDidMount() {
    // const tripId = this.props.match.params.id;
    // return axios.get(`/api/trips/${tripId}/activities`).then(res => {
    //   this.setState({ activities: res.data });
    //   this.getItineraries();
    // });
    this.getActivities(this.getItineraries);
    this.getTrip();
  }

  getItineraries = (itinerary) => {
    const tripId = this.props.match.params.id;
    return axios.get(`/api/trips/${tripId}/itineraries`).then(res => {
      // console.log('itineraries', res.data);
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
      }
    });
  }

  getEvents = (itinerary) => {
    return axios.get(`/api/itineraries/${itinerary.id}/events`).then(res => {
      // console.log('events', res.data); // TODO not showing new event?
      const existingEvents = res.data.map((event) => {
        // console.log(this.state.activities);
        const matchedActivity = this.state.activities.filter(activity => activity.id === event.activityId);
        const activity = matchedActivity.length > 0 ? matchedActivity[0] : {
          id: "",
          name: ""
        };
        return {
          start: new Date(event.startDateTime.replace(" ", "T")),
          end: new Date(event.endDateTime.replace(" ", "T")),
          title: activity.name,
          id: event.id
        }
      });
      this.setState({ existingEvents: existingEvents });
    });
  }

  getActivities = (callBack) => {
    const tripId = this.props.match.params.id;
    return axios.get(`/api/trips/${tripId}/activities`).then(res => {
      this.setState({ activities: res.data });
      // console.log('activities', res.data);
      if (callBack) callBack();
    });
  }

  getTrip = () => {
    const tripId = this.props.match.params.id;
    return axios.get(`/api/trips/${tripId}`).then(res => {
      this.setState({ tripName: res.data.name });
    });
  }

  handleSelectItinerary = (itinerary) => {
    return () => {
      this.getEvents(itinerary).then(() => {
        this.setState({ itinerary: itinerary });
      });
    }
  }

  toggleCreateActivityModal = () => {
    this.setState({showCreateActivity: !this.state.showCreateActivity});
  }
  toggleEditActivityModal = (activity) => {
    this.setState({
      showEditActivity: !this.state.showEditActivity,
      activityToEdit: activity
    });
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
  toggleCreateEventModal = (start, end, draggedActivityId) => { //TODO: set defaults
    this.setState({
      createEventStart: start,
      createEventEnd: end,
      draggedActivityId: draggedActivityId,
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
  editActivitiesDone = () => {
    this.getActivities();
  }

  handleSelectEvent = (event) => {
    const selectedEvent = { ...event };
    selectedEvent.start = formatDate(event.start);
    selectedEvent.end = formatDate(event.end);
    this.setState({
      showEditEvent: true,
      selectedEvent: selectedEvent
    });
  }

  render() {
    var trip = this.props.location.state.trip
    var tripId = this.props.match.params.id;

    const defaultDate = trip.startDate === "" ? formatDate(new Date()).substring(0,10) : trip.startDate;
    const defaultStart = defaultDate + "T12:00";
    const defaultEnd = defaultDate + "T13:00";

    const {
      activities,
      itineraries,
      itinerary,
      selectedEvent,
      existingEvents,
      showCreateActivity,
      showEditActivity,
      showEditTrip,
      showCreateItinerary,
      showEditItinerary,
      showCreateEvent,
      showEditEvent,
      createEventEnd,
      createEventStart,
      tripName,
      draggedActivityId
    } = this.state;

    if (showCreateActivity) {
      return (
        <CreateActivityModal 
          hideCreateModal={this.toggleCreateActivityModal}
          tripId={trip.tripId}
          editActivitiesDone={this.editActivitiesDone}
        />
      )
    } else if (showEditActivity) {
      return (
        <EditActivityModal 
          hideEditModal={this.toggleEditActivityModal} 
          tripId={trip.tripId}
          activity={this.state.activityToEdit}
        />
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
          <TripnameBar
            toggleEditTripModal={this.toggleEditTripModal}
            tripName={tripName}
          />
          <div className="trip-details">
            <Activities 
              showCreateModal={this.toggleCreateActivityModal}
              showEditModal={this.toggleEditActivityModal}
              tripId={tripId}
              toggleCreateEventModal={this.toggleCreateEventModal}
            />
            <Itinerary
              toggleCreateItineraryModal={this.toggleCreateItineraryModal}
              toggleEditItineraryModal={this.toggleEditItineraryModal}
              toggleCreateEventModal={this.toggleCreateEventModal}
              itinerary={itinerary}
              itineraries={itineraries}
              existingEvents={existingEvents}
              handleSelectItinerary={this.handleSelectItinerary}
              handleSelectEvent={this.handleSelectEvent}
              defaultDate={defaultDate}
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
              start={createEventStart} //TODO
              end={createEventEnd}
              editEventsDone={this.editEventsDone}
              activities={activities}
              activityId={draggedActivityId}
              defaultStart={defaultStart}
              defaultEnd={defaultEnd}
            />

            <EditEventModal
              showModal={showEditEvent}
              toggleModal={this.toggleEditEventModal}
              itinerary={itinerary}
              event={selectedEvent}
              editEventsDone={this.editEventsDone}
            />
          </div>
        </div>
      )
    }
  }
}

export default DragDropContext(HTML5Backend)(Trip);