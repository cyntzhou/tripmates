import React from "react";
import styles from "./trips.css";
import AddButton from "../components/add-button.jsx";
import TripItem from "./trip-item.jsx";
import CreateTripModal from "./create-trip-modal.jsx";


class Trips extends React.Component {
  state = {showModal: false};

  showModal = () => {
    this.setState({show: true});
  }

  hideModal = () => {
    this.setState({show: false});
  }

  render() {
    return (
      <div className="trips">
        {this.state.show ? (<CreateTripModal hideModal={this.hideModal}/>) : (
          <React.Fragment>
            <div className="trip-header">
              <h1>My Trips</h1>
              <AddButton onButtonClick={this.showModal}/>
            </div>
            <div className="trip-body">
              <TripItem 
                tripName="TripName here" 
                tripDate="tripdate01 - tripdate02"
                tripUsers="Janicecream, cyndaquil, sopdrop, nanc"
                tripId="idNumber"
              />
            </div>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default Trips;