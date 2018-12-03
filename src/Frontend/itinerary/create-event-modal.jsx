import React from "react";
import axios from "axios";
import Modal from "../components/modal.jsx";
import Textfield from "../components/textfield.jsx";
import Button from "../components/button.jsx";

class CreateEventModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start: "",
      end: "",
      activityId: 1, // TODO
      errors: []
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      start: nextProps.start,
      end: nextProps.end
    });
  }

  handleCreate = () => {
    const { start, end, activityId } = this.state;
    const { itinerary, toggleModal, editEventsDone } = this.props;
    const errors = [];
    // if (name.length === 0) {
    //   errors.push("Please enter a name.");
    // }
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
        console.log(err);
        console.log(err);
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
      errors
    } = this.state;

    const {
      showModal,
      toggleModal,
      activities
    } = this.props;

    return (
      <Modal show={showModal} handleClose={toggleModal}>
        <div>
          Activity:
          <select onChange={this.handleSelectActivity}>
            {activities.map((activity) => {
              return (
                <option value={activity.id} key={activity.id}>{activity.name}</option>
              )
            })}
          </select>
        </div>

        <div>
          Start:
          <input
            type="datetime-local"
            value={start}
            // min="2018-06-07T00:00"
            // max="2018-06-14T00:00"
            onChange={this.handleChangeStart}
          />
        </div>

        <div>
          End:
          <input
            type="datetime-local"
            value={end}
            // min="2018-06-07T00:00"
            // max="2018-06-14T00:00"
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
            label="Create"
            onButtonClick={this.handleCreate}
          />
        </div>
      </Modal>
    )
  }
}

export default CreateEventModal;
