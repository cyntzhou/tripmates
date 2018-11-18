import React from "react";
import styles from "./create-trip.css";
import JoinTrip from "./join-trip.jsx";
import CreateNewTrip from "./create-new-trip.jsx";

class CreateTripModal extends React.Component {
  render() {
    const {hideModal} = this.props
    return (
      <div className="modal-container">
        <CreateNewTrip hideModal={hideModal}/>
        <JoinTrip hideModal={hideModal}/>
      </div>
    )
  }
}

export default CreateTripModal;