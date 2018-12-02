import React from "react";
import axios from "axios";
import styles from "./trips.css";
import AddButton from "../components/add-button.jsx";
import TripItem from "./trip-item.jsx";
import CreateTripModal from "./create-trip-modal.jsx";


class Trips extends React.Component {
  constructor() {
    super() 
    this.state = {
      showModal: false,
      tripsList: []
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

  showModal = () => {
    this.setState({show: true});
  }

  hideModal = () => {
    this.setState({show: false});
    this.getTrips();
  }

  render() {
    console.log(this.state);
    return (
      <div className="trips">
        {this.state.show ? (
          <CreateTripModal 
            hideModal={this.hideModal} 
          />
        ) : (
          <>
            <div className="trip-header">
              <h1>My Trips</h1>
              <AddButton onButtonClick={this.showModal}/>
            </div>
            <div className="trip-body">
              {this.state.tripsList.map(function(trip, index){
                return <TripItem 
                  key={index}
                  trip={trip}
                />
              })}
            </div>
          </>
        )}
      </div>
    )
  }
}

export default Trips;