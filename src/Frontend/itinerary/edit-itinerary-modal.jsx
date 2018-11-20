import React from "react";
import Modal from "../components/modal.jsx";
import Textfield from "../components/textfield.jsx";
import Button from "../components/button.jsx";

class EditItineraryModal extends React.Component {
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
    const { tripId, toggleModal } = this.props;
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
        console.log(res);
        handleClose();
        // eventBus.$emit('change-username-success', true);
      })
      .catch(err => {
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
        <span>Edit the name for this Itinerary: </span>
        <Textfield
          placeholder="name"
          onChange={this.handleChangeName}
          value={name}
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
      </Modal>
    )
  }
}

export default EditItineraryModal;