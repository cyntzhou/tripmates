import React from "react";
import axios from "axios";
import Modal from "../components/modal.jsx";
import Button from "../components/button.jsx";

class ShareTripModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      showModal,
      toggleModal,
      codeValue,
      trip
    } = this.props;

    return (
      <Modal show={showModal} handleClose={toggleModal}>
        <div>Share the trip's code with your fellow tripmates: </div>

        {trip &&
          <div>
            {trip.joinCode}
          </div>
        }

        <div className="settings-buttons">
          <Button
            label="Close"
            onButtonClick={toggleModal}
          />
        </div>
      </Modal>
    )
  }
}

export default ShareTripModal;
