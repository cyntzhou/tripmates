import React from "react";
import axios from "axios";
import Modal from "../components/modal.jsx";
import Textfield from "../components/textfield.jsx";
import Button from "../components/button.jsx";
import styles from "./event.css";

class EditEventModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start: "",
      end: "",
      errors: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.event) {
        this.setState({
        start: nextProps.event.start,
        end: nextProps.event.end
      });
    }
  }

  handleSave = () => {
    const { start, end } = this.state;
    const { event, toggleModal, editEventsDone } = this.props;
    const errors = [];
    if (errors.length > 0) {
      this.setState({ errors: errors });
      return;
    }

    const formattedStart = start.replace("T", " ") + ":00";
    const formattedEnd = end.replace("T", " ") + ":00";

    const bodyContent = {
      newStart: formattedStart,
      newEnd: formattedEnd
    };
    axios
      .put(`/api/events/${event.id}`, bodyContent)
      .then(res => {
        toggleModal();
        editEventsDone();
      })
      .catch(err => {
        if (err.response.status === 403) {
          alert("You cannot edit this event since another user has deleted this trip.");
          // TODO lead back to trips page
        }
        if (err.response.status === 404) {
          alert("You cannot edit since the event or current itinerary has been deleted.");
          toggleModal();
          editEventsDone();
        }
        const errors = [err.response.data.error];
        this.setState({
          errors: errors
        })
      });
  }

  handleDelete = () => {
    const { event, toggleModal, editEventsDone } = this.props;
    axios
      .delete(`/api/events/${event.id}`)
      .then(res => {
        toggleModal();
        editEventsDone();
      })
      .catch(err => {
        if (err.response.status === 403) {
          alert("You cannot delete this event since another user has deleted this trip.");
          // TODO lead back to trips page
        }
        if (err.response.status === 404) {
          alert("You cannot delete since the event or current itinerary has been deleted.");
          toggleModal();
          editEventsDone();
        }
        const errors = [err.response.data.error];
        this.setState({
          errors: errors
        })
      });
  }

  handleChangeStart = (event) => {
    this.setState({ start: event.target.value });
  }

  handleChangeEnd = (event) => {
    this.setState({ end: event.target.value });
  }

  render() {
    const {
      start,
      end,
      errors
    } = this.state;

    const {
      showModal,
      toggleModal
    } = this.props;

    return (
      <Modal show={showModal} handleClose={toggleModal}>
        <div className="required">
          Start:
          <input
            type="datetime-local"
            value={start}
            onChange={this.handleChangeStart}
          />
        </div>

        <div className="required">
          End:
          <input
            type="datetime-local"
            value={end}
            onChange={this.handleChangeEnd}
          />
        </div>


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

        <Button
          label="Delete"
          onButtonClick={this.handleDelete}
          colorClassName="btn-red-background"
        />
      </Modal>
    )
  }
}

export default EditEventModal;
