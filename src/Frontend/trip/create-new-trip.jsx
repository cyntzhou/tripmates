import React from "react";
import axios from "axios";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import styles from "./create-trip.css";
import Button from "../components/button.jsx";

var moment = require('moment');

class CreateNewTrip extends React.Component {
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

    axios.post('api/trips', bodyContext).then(res => {
      this.props.getTrips();
      this.props.hideModal();
    }).catch(
      err => console.log(err)
    );
  }

  render() {
    return (
      <div>
        <h3>Create New Trip</h3>
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
        <Button label="Cancel" onButtonClick={this.props.hideModal}/>
        <Button label="Save" onButtonClick={this.onSave}/>
      </div>
    )
  }
}

export default CreateNewTrip;