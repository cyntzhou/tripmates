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
import NotFound from "../components/not-found.jsx";
import { formatDate } from "../utils.js";
import TripMap from "./trip-map.jsx";
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
      showMap: false,
      activities: [],
      itineraries: [],
      itinerary: null,
      activityToEdit: null,
      createEventStart: "",
      createEventEnd: "",
      existingEvents: [],
      selectedEvent: null,
      tripName: "",
      trip: null,
      notFound: false
    }
  }

  componentDidMount() {
    this.getActivities(this.getItineraries);
    this.getTrip();

    this.intervalCallback(this.getActivities, this.getItineraries, this.getTrip);
  }

  intervalCallback(cb1, cb2, cb3) {
    setInterval(function() {
      cb1(cb2);
      cb3();
    }, 5000);
  }

  getItineraries = (itinerary) => {
    const tripId = this.props.match.params.id;
    return axios.get(`/api/trips/${tripId}/itineraries`).then(res => {
      const newState = {
        itineraries: res.data
      }
      if (res.data.length > 0 && !itinerary) {
        newState["itinerary"] = res.data[0];
      } else {
        newState["itinerary"] = itinerary;
      }

      if (newState["itinerary"] !== null && newState["itinerary"] !== undefined) {
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
      const existingEvents = res.data.map((event) => {
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
      if (callBack) callBack();
    });
  }

  getTrip = () => {
    const tripId = this.props.match.params.id;
    return axios.get(`/api/trips/${tripId}`).then(res => {
      const trip = res.data;
      trip['tripId'] = tripId;
      this.setState({
        tripName: res.data.name,
        trip: trip
      });
    }).catch(err => {
      if (err.response.status === 403 || err.response.status === 404) {
        this.setState({ notFound: true });
      }
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
  toggleEditActivityModal = (activity = null) => {
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
    const firstActivityId = this.state.activities.length > 0 ? this.state.activities[0].id : 1;
    const activityId = draggedActivityId ? draggedActivityId : firstActivityId;
    this.setState({
      createEventStart: start,
      createEventEnd: end,
      draggedActivityId: activityId,
      showCreateEvent: !this.state.showCreateEvent
    });
  }
  toggleEditEventModal = () => {
    this.setState({showEditEvent: !this.state.showEditEvent});
  }

  toggleMap = () => {
    this.setState({showMap: !this.state.showMap});
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
  editTripDone = () => {
    this.getTrip();
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

  starItinerary = () => {
    const { itinerary } = this.state;
    return axios.put(`/api/itineraries/${itinerary.id}/star`).then(res => {
      this.editItinerariesDone(res.data);
    });
  }

  unstarItinerary = () => {
    const { itinerary } = this.state;
    return axios.put(`/api/itineraries/${itinerary.id}/unstar`).then(res => {
      this.editItinerariesDone(res.data);
    });
  }

  render() {
    var tripId = this.props.match.params.id;

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
      showMap,
      createEventEnd,
      createEventStart,
      tripName,
      draggedActivityId,
      trip,
      notFound
    } = this.state;

    const defaultDate = trip ?
      (trip.startDate === "" ? formatDate(new Date()).substring(0,10) : trip.startDate)
      : "";
    const defaultStart = trip ? defaultDate + "T12:00" : "";
    const defaultEnd = defaultDate + "T13:00";
    const userId = this.props.cookies.get("user-id");

    if (!this.props.location.state || !this.props.location.state.trip || notFound) {
      return (
        <NotFound
          message="Trip has either been deleted or has never existed."
        />
      )
    } else if (showEditActivity) {
      return (
        <EditActivityModal
          showModal={showEditActivity}
          toggleModal={this.toggleEditActivityModal}
          tripId={trip.tripId}
          activity={this.state.activityToEdit}
          editActivitiesDone={this.editActivitiesDone}
        />
      )
    } else if (showEditTrip) {
      return (
        <EditTripModal
          showModal={showEditTrip}
          toggleModal={this.toggleEditTripModal}
          trip={trip}
          editTripDone={this.editTripDone}
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
              activitiesList={activities}
              userId={userId}
            />

            <CreateActivityModal
              showModal={showCreateActivity}
              toggleModal={this.toggleCreateActivityModal}
              tripId={trip ? trip.tripId : null}
              editActivitiesDone={this.editActivitiesDone}
            />

            <div className="itin-map">
              {showMap? (
                  <TripMap 
                    toggleMap={this.toggleMap}
                    tripId={tripId} 
                    activities={activities}
                  />
              ) : (
                <>
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
                    starItinerary={this.starItinerary}
                    unstarItinerary={this.unstarItinerary}
                  />
                  <i 
                    id="map-btn" 
                    className="fa fa-map" 
                    aria-hidden="true"
                    onClick={this.toggleMap}
                  > Show Map </i>
                </>
              ) }
            </div>

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
