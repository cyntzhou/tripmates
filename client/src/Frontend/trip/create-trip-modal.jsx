import React from "react";
import styles from "./create-trip.css";
import JoinTrip from "./join-trip.jsx";
import CreateNewTrip from "./create-new-trip.jsx";
import Modal from '../components/modal.jsx';

class CreateTripModal extends React.Component {
  render() {
    const {
      showModal,
      toggleModal,
      getTrips
    } = this.props
    return (
      <Modal show={showModal} handleClose={toggleModal}>
        <div className="modal-container">
          <CreateNewTrip hideModal={toggleModal} getTrips={this.getTrips}/>
          <JoinTrip hideModal={toggleModal}/>
        </div>
      </Modal>
    )
  }
}

export default CreateTripModal;