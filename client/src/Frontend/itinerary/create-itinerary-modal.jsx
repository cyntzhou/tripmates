import React from "react";
import axios from "axios";
import Modal from "../components/modal.jsx";
import Textfield from "../components/textfield.jsx";
import Button from "../components/button.jsx";

class CreateItineraryModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      errors: []
    }
  }

  resetForm = () => {
    this.setState({ errors: [] });
  }

  handleChangeName = (event) => {
    this.setState({ name: event.target.value });
  }

  handleCreate = () => {
    const { name } = this.state;
    const { tripId, toggleModal, editItinerariesDone } = this.props;
    const errors = [];
    if (name.length === 0) {
      errors.push("Please enter a name.");
    }
    if (errors.length > 0) {
      this.setState({ errors: errors });
      return;
    }
    
    const bodyContent = { name: name, tripId: tripId };
    axios
      .post(`/api/itineraries`, bodyContent)
      .then(res => {
        const itinerary = res.data;
        console.log(itinerary);
        toggleModal();
        editItinerariesDone(itinerary);
        // eventBus.$emit('change-username-success', true);
      })
      .catch(err => {
        console.log(err);
        const errors = [err.response.data.error];
        this.setState({
          errors: errors
        })
      })
      .then(() => {
        this.resetForm();
      });
  }

  render() {
    const {
      name,
      errors
    } = this.state;

    const {
      showModal,
      toggleModal
    } = this.props;

    return (
      <Modal show={showModal} handleClose={toggleModal}>
        <span>Enter a name for your new Itinerary: </span>
        <Textfield
          placeholder="name"
          onChange={this.handleChangeName}
          value={name}
          maxLength={40}
        />

        {errors.length > 0 &&
          <div className="settings-error-message">
            <ul>
              {errors.map((error, i) => {
                  return <li key={i}>{error}</li>;
              })}
            </ul>
          </div>
        }

        <div className="settings-buttons">
          <Button
            label="Cancel"
            onButtonClick={toggleModal}
          />
          <Button
            label="Create"
            onButtonClick={this.handleCreate}
          />
        </div>
      </Modal>
    )
  }
}

export default CreateItineraryModal;