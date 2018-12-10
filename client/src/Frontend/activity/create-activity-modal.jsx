import React from "react";
import axios from "axios";
import moment from 'moment';
import styles from "./create-activity.css";
import Modal from '../components/modal.jsx';
import Button from "../components/button.jsx";
import OpenHoursCalendar from './hours-calender.jsx';

class CreateActivityModal extends React.Component{
  constructor() {
    super()
    this.state = {
      name: null,
      category: null,
      suggestedHours: null,
      suggestedMins: null,
      address: null,
      placeName: null,
      openHours: [],
      placeId: null,
      errors: []
    }
  }

  updateOpenHours = (newHours) => {
    this.setState({
      openHours: newHours
    })
  }

  createHours = () => {
    this.state.openHours.forEach((timeSeg) => {
      const hoursBody = {
        placeId: this.state.placeId,
        day: timeSeg.resourceId,
        startTime: moment(timeSeg.start).format('HH:mm'),
        endTime: moment(timeSeg.end).format('HH:mm')
      }
      axios.post(`/api/places/${this.state.placeId}/hours`, hoursBody)
        .then()
        .catch(err => {
        })
    })
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSave = () => {
    const {
      name,
      category,
      suggestedHours,
      suggestedMins,
      address,
      placeName,
      placeId,
      openHours
    } = this.state;

    if (name == null || name == '') {
      alert("An activity name is required!")
      return;
    }

    let suggestedDuration = null;

    //convert input to minutes
    if (suggestedHours || suggestedMins) {
      const hours = (suggestedHours * 60 || 0) ;
      suggestedDuration = parseInt(hours) + parseInt(suggestedMins || 0);
    }

    const bodyContext = {
      name,
      tripId: this.props.tripId,
      suggestedDuration,
      placeId,
      category
    }
    const errors = [];

    if ((address || openHours) && placeName) {
      let placeBody = {name: null, address: null};
      if (placeName) {
        placeBody['name'] = placeName
      }
      if (address) {
        placeBody['address'] = address;
      }

      axios.post('/api/places', placeBody).then(res => {
        this.setState({
          placeId: res.data.insertId
        });
        bodyContext['placeId'] = res.data.insertId
        axios.post('/api/activities', bodyContext).then(() => {
          this.createHours();
          this.props.toggleModal();
          this.props.editActivitiesDone();
        }).catch(err => {
          if (err.response.status === 403) {
            this.props.toggleModal();
            alert("You cannot create an activity since another user has deleted this trip.");
            // TODO lead back to trips page
          }
        });
      }).catch(err => console.log(err));
    } else if ((address !== null || openHours.length !== 0) && !placeName) {
      errors.push("To add a place, you must add a place name.");
      if (errors.length > 0) {
        this.setState({
          errors: errors
        });
      }
    } else {
      axios.post('/api/activities', bodyContext).then(() => {
        this.props.toggleModal();
        this.props.editActivitiesDone();
      }).catch(err => {
        if (err.response.status === 403) {
          this.props.toggleModal();
          alert("You cannot create an activity since another user has deleted this trip.");
          // TODO lead back to trips page
        }
      });
    }
  }

  render() {
    const {
      openHours,
      errors
    } = this.state

    const {
      showModal,
      toggleModal
    } = this.props;
    return (
      <Modal show={showModal} handleClose={toggleModal}>
        <h3 id="title">Create Activity</h3>
        <form id="create-form">
          <label className="required">Activity Name:
            <input type="text" name="name" onChange={this.onChange} maxLength="40" required/>
          </label>
          <h4 id="optional-details">Optional Details</h4>
          <label>Category:
            <input type="text" name="category" onChange={this.onChange} maxLength="20"/>
          </label>
          <label>Suggested Duration:
            <input id="hours" type="number" min="0" name="suggestedHours" placeholder="hours" onChange={this.onChange}/>
            <input id="mins" type="number" min="0" name="suggestedMins" placeholder="mins" onChange={this.onChange}/>
          </label>
          <p>Place:</p>
          <div>
            <label>Name:
              <input type="text" name="placeName" onChange={this.onChange} maxLength="40"/>
            </label>
            <label>Address:
              <input type="text" name="address" onChange={this.onChange} maxLength="100"/>
            </label>
          </div>
          <p>Open Hours:</p>
          <div className="hours-cal">
            <OpenHoursCalendar openHours={openHours} updateHours={this.updateOpenHours} />
          </div>
        </form>
        <div className="btns-container">
          <Button colorClassName="btn-gray-background" label="Cancel" onButtonClick={toggleModal}/>
          <Button label="Create" onButtonClick={this.onSave}/>
        </div>

        {errors.length > 0 &&
          <div className="error-message">
            <ul>
              {errors.map((error, i) => {
                  return <li key={i}>{error}</li>;
              })}
            </ul>
          </div>
        }
      </Modal>
    )
  }
}

export default CreateActivityModal;
