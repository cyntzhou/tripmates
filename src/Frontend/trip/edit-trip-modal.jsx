import React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import styles from "./edit-trip.css";
import Button from "../components/button.jsx";

var moment = require('moment');

class EditTripModal extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      startDate: '',
      endDate: ''
    }
  }
  setStartDate = (day) => {
    const dateString = moment(day).format("YYYY-MM-DD");
    this.setState({
      startDate: dateString,
    })
  }

  setEndDate = (day) => {
    const dateString = moment(day).format("YYYY-MM-DD");
    this.setState({
      endDate: dateString,
    })
  }

  onSave = () => {
    const {name, startDate, endDate} = this.state;
    const bodyContext = {name, startDate, endDate};

    axios.put(`api/trips/${this.props.tripId}`, bodyContext).then(res => {
      this.props.hideModal();
    }).catch(err => console.log(err))
  }

  onDelete = () => {
    axios.delete(`api/trips/${this.props.tripId}`).then(() => {
      this.props.history.push('/trips');
    }).catch(err => console.log(err))
  }

  render() {
    const {
      tripDate, 
      tripName, 
      tripUsers,
      hideModal
    } = this.props;
    return (
      <div>
        <h3>Edit Trip Details</h3>
        <form>
          <label>Trip Name:
            <input type="text" name="nameValue" onChange={this.onChange}/>
          </label>
          <label>Start Date:
            <DayPickerInput onDayChange={this.setStartDate}/>
          </label>
          <label>End Date:
            <DayPickerInput onDayChange={this.setEndDate}/>
          </label>
        </form>
        <div className="trip-users">
          <i className="fa fa-users"/>
          {tripUsers}
        </div>
        <Button label="Cancel" onButtonClick={hideModal}/>
        <Button label="Save" onButtonClick={this.onSave}/>
        <Button label="Delete" onButtonClick={this.onDelete}/>
      </div>
    )
  }
}

export default withRouter(EditTripModal);