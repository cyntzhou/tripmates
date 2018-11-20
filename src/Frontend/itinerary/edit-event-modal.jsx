import React from "react";
import axios from "axios";
import Modal from "../components/modal.jsx";
import Textfield from "../components/textfield.jsx";
import Button from "../components/button.jsx";

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
    if (this.state.start === "" && this.state.end === "" && nextProps.event) {
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
        console.log(err);
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
        console.log(err);
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
            label="Save"
            onButtonClick={this.handleSave}
          />
        </div>

        <Button 
          label="Delete"
          onButtonClick={this.handleDelete}
          colorClassName="btn-red"
        />
      </Modal>
    )
  }
}

export default EditEventModal;