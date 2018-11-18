import React from "react";
import styles from "./create-trip.css";
import JoinTrip from "./join-trip.jsx";
import CreateNewTrip from "./create-new-trip.jsx";

class CreateTripModal extends React.Component {
  render() {
    const {onCancel} = this.props
    return (
      <div className="modal-container">
        <CreateNewTrip onCancel={onCancel}/>
        <JoinTrip onCancel={onCancel}/>
      </div>
    )
  }
}

export default CreateTripModal;