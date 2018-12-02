import React from "react";
import axios from "axios";
import moment from 'moment';
import styles from "./create-activity.css";
import Button from "../components/button.jsx";
import OpenHoursCalendar from './hours-calender.jsx';

class CreateActivityModal extends React.Component{
  constructor() {
    super()
    this.state = {
      name: '',
      category: null,
      suggestedHours: null,
      suggestedMins: null,
      address: null,
      placeName: null,
      openHours: [],
      placeId: null,
    }
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
      placeId
    } = this.state;

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

    if (address || placeName) {
      let placeBody = {name: 'defaul', address: 'default'};
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
          this.props.hideCreateModal();
          this.props.editActivitiesDone();
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    }
  }

  render() {
    const {
      openHours
    } = this.state
    return (
      <div className="modal-container">
        <h3>Create Activity</h3>
        <form>
          <label>Activity Name:
            <input type="text" name="name" onChange={this.onChange}/>
          </label>
          <h4>Optional Details</h4>
          <label>Category:
            <input type="text" name="category" onChange={this.onChange}/>
          </label>
          <label>Suggested Duration:
            <input type="number" min="0" name="suggestedHours" placeholder="hours" onChange={this.onChange}/>
            <input type="number" min="0" name="suggestedMins" placeholder="mins" onChange={this.onChange}/>
          </label>
          <p>Place:</p>
          <label>Name:
            <input type="text" name="placeName" onChange={this.onChange}/>
          </label>
          <label>Address:
            <input type="text" name="address" onChange={this.onChange}/>
          </label>
          <p>Open Hours:</p>
          <div>
            <OpenHoursCalendar openHours={openHours} />
          </div>
        </form>
        <div className="btns-container">
          <Button label="Cancel" onButtonClick={this.props.hideCreateModal}/>
          <Button label="Create" onButtonClick={this.onSave}/>
        </div>
      </div>
    )
  }
}

export default CreateActivityModal;