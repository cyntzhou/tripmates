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
      const tripIds = res.data;
      for (var i = 0; i < tripIds.length; i++) {
        const tripId = tripIds[i].tripId
        axios.get(`/api/trips/${tripId}`).then(tripData => {
          tripData.data['tripId'] = tripId;
          tripObjs.push(tripData.data)
        }).catch(err => console.log(err));
      }
    }).catch(err => console.log(err));

    this.setState({
      tripsList: tripObjs
    });
  }

  showModal = () => {
    this.setState({show: true});
  }

  hideModal = () => {
    this.setState({show: false});
    this.getTrips();
  }

  render() {
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