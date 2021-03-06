import React from "react";
import axios from "axios";
import Modal from "../components/modal.jsx";
import Textfield from "../components/textfield.jsx";
import Button from "../components/button.jsx";
import styles from "./event.css";

class CreateEventModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start: "",
      end: "",
      activityId: 1,
      errors: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.start !== "" && nextProps.end !== "") {
      this.setState({
        start: nextProps.start,
        end: nextProps.end
      });
    } else if (nextProps.defaultStart !== "" && nextProps.defaultEnd !== "") {
      this.setState({
        start: nextProps.defaultStart,
        end: nextProps.defaultEnd
      });
    }
    if (nextProps.activityId) {
      this.setState({
        activityId: nextProps.activityId
      });
    }
  }

  handleCreate = () => {
    const { start, end, activityId } = this.state;
    const { itinerary, toggleModal, editEventsDone } = this.props;
    const errors = [];
    if (errors.length > 0) {
      this.setState({ errors: errors });
      return;
    }

    const formattedStart = start.replace("T", " ") + ":00";
    const formattedEnd = end.replace("T", " ") + ":00";

    const bodyContent = {
      itineraryId: itinerary.id,
      activityId: activityId,
      start: formattedStart,
      end: formattedEnd
    };
    axios
      .post(`/api/events`, bodyContent)
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
          alert("You cannot create this event since this itinerary or activity has been deleted.");
          toggleModal();
        }
        const errors = [err.response.data.error];
        this.setState({
          errors: errors
        });
      });
  }

  handleChangeStart = (event) => {
    this.setState({ start: event.target.value });
  }

  handleChangeEnd = (event) => {
    this.setState({ end: event.target.value });
  }

  handleSelectActivity = (event) => {
    this.setState({ activityId: event.target.value });
  }

  render() {
    const {
      start,
      end,
      errors,
      activityId
    } = this.state;

    const {
      showModal,
      toggleModal,
      activities
    } = this.props;

    return (
      <Modal show={showModal} handleClose={toggleModal}>
        <div className="required">
          Activity:
          <select
            onChange={this.handleSelectActivity}
            value={activityId}
          >
            {activities.map((activity) => {
              return (
                <option value={activity.id} key={activity.id}>{activity.name}</option>
              )
            })}
          </select>
        </div>

        <div className="required">
          Start:
          <input
            type="datetime-local"
            value={start}
            onChange={this.handleChangeStart}
            required
          />
        </div>

        <div className="required">
          End:
          <input
            type="datetime-local"
            value={end}
            onChange={this.handleChangeEnd}
            required
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
            label="Create"
            onButtonClick={this.handleCreate}
          />
        </div>
      </Modal>
    )
  }
}

export default CreateEventModal;
