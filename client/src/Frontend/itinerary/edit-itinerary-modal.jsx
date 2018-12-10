import React from "react";
import axios from "axios";
import Modal from "../components/modal.jsx";
import Textfield from "../components/textfield.jsx";
import Button from "../components/button.jsx";
import styles from "./itinerary.css";

class EditItineraryModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      errors: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.name === "" && nextProps.itinerary) {
      this.setState({ name: nextProps.itinerary.name });
    }
  }

  resetForm = () => {
    this.setState({ errors: [] });
  }

  handleChangeName = (event) => {
    this.setState({ name: event.target.value });
  }

  handleSave = () => {
    const { name } = this.state;
    const { tripId, toggleModal, itinerary, editItinerariesDone } = this.props;
    const errors = [];
    if (name.length === 0) {
      errors.push("Please enter a new name.");
    }
    if (errors.length > 0) {
      this.setState({ errors: errors });
      return;
    }

    const bodyContent = { newName: name };
    axios
      .put(`/api/itineraries/${itinerary.id}/name`, bodyContent)
      .then(res => {
        const itinerary = res.data;
        toggleModal();
        editItinerariesDone(itinerary);
        // eventBus.$emit('change-username-success', true);
      })
      .catch(err => {
        console.log(err);

        if (err.response.status === 403) {
          alert("You cannot edit this itinerary since another user has deleted this trip.");
          // TODO lead back to trips page
        }
        if (err.response.status === 404) {
          alert("You cannot edit this itinerary since another user has deleted it.");
          toggleModal();
          editItinerariesDone(null);
        }

        const errors = [err.response.data.error];
        this.setState({ errors: errors });
      })
      .then(() => {
        this.resetForm();
      });
  }

  handleDelete = () => {
    const { itinerary, toggleModal, editItinerariesDone } = this.props;
    axios
      .delete(`/api/itineraries/${itinerary.id}`)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 403) {
          alert("You cannot delete this itinerary since another user has deleted this trip.");
          // TODO lead back to trips page
        }
        if (err.response.status === 404) {
          alert("You cannot delete this itinerary since another user has already deleted it.");
          toggleModal();
          editItinerariesDone(null);
        }
        const errors = [err.response.data.error];
        this.setState({ errors: errors });
      })
      .then(() => {
        toggleModal();
        editItinerariesDone(null);
      })
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
        <span className="required">Edit the name for this Itinerary: </span>
        <Textfield
          placeholder="name"
          onChange={this.handleChangeName}
          value={name}
          maxLength={40}
          required
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
            label="Save"
            onButtonClick={this.handleSave}
          />
        </div>

        <div>
          <Button
            label="Delete Itinerary"
            colorClassName="btn-red-background"
            onButtonClick={this.handleDelete}
          />
        </div>
      </Modal>
    )
  }
}

export default EditItineraryModal;
