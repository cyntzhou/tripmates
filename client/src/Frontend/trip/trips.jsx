import React from "react";
import axios from "axios";
import styles from "./trips.css";
import AddButton from "../components/add-button.jsx";
import TripItem from "./trip-item.jsx";
import CreateTripModal from "./create-trip-modal.jsx";
import ShareTripModal from "./share-trip-modal.jsx";

class Trips extends React.Component {
  constructor() {
    super()
    this.state = {
      showCreateTripModal: false,
      showShareTripModal: false,
      tripsList: [],
      selectedTrip: null
    }
    this.getTrips = this.getTrips.bind(this);
  }

  componentDidMount() {
    this.getTrips();
  }

  getTrips(){
    const userId = this.props.cookies.get("user-id");
    const tripObjs = [];

    axios.get(`/api/users/${userId}/trips`).then(res => {
      const trips = res.data;
      const getTripDataRequests = trips.map((trip) => {
        const tripId = trip.tripId;
        return axios.get(`/api/trips/${tripId}`).then(tripData => {
          tripData.data['tripId'] = tripId;
          tripObjs.push(tripData.data);
        }).catch(err => console.log(err));
      });
      Promise.all(getTripDataRequests).then(() => {
        this.setState({
          tripsList: tripObjs
        });
      })
    }).catch(err => console.log(err));
  }

  showCreateTripModal = () => {
    this.setState({showCreateTripModal: true});
  }

  hideModal = () => {
    this.setState({showCreateTripModal: false});
    this.getTrips();
  }

  toggleShareTripModal = (trip) => {
    if (trip) {
      this.setState({ selectedTrip: trip });
    }
    this.setState({ showShareTripModal: !this.state.showShareTripModal });
  }

  render() {
    console.log(this.state);
    const {
      showCreateTripModal,
      showShareTripModal,
      tripsList,
      selectedTrip
    } = this.state;

    return (
      <div className="trips">
        <div className="trip-header">
          <h1>My Trips</h1>
          <AddButton onButtonClick={this.showCreateTripModal}/>
        </div>
        <div className="trip-body">
          {tripsList.length > 0 && tripsList.map((trip, index) => {
            return <TripItem 
              key={index}
              trip={trip}
              toggleShareTripModal={this.toggleShareTripModal}
            />
          })}
          {tripsList.length < 1 && 
            <p id="add-prompt">Get started by adding a trip!</p>
          }
        </div>
        <CreateTripModal
          showModal={showCreateTripModal}
          toggleModal={this.hideModal}
        />
        <ShareTripModal
          showModal={showShareTripModal}
          toggleModal={this.toggleShareTripModal}
          trip={selectedTrip}
        />
      </div>
    )
  }
}

export default Trips;
