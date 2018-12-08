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
      name: null,
      startDate: null,
      endDate: null
    }
  }

  setName = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  setStartDate = (day) => {
  let dateString;
    if (day == undefined) {
      dateString = moment(null).format("YYYY-MM-DD");
    } else {
      dateString = moment(day).format("YYYY-MM-DD");
    }
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
    if (name == null || name == '') {
      alert('A trip name is required')
    } else {
      if (moment(endDate).isSameOrAfter(startDate)) {
        const bodyContext = {
          name,
          startDate: startDate,
          endDate: endDate
        };
        axios.post('/api/trips', bodyContext).then(() => {
          this.props.hideModal();
        }).catch(
          err => console.log(err)
        );
      } else {
        alert('please choose valid dates')
      }
    }
  }

  render() {
    return (
      <div className="create-container">
        <h3 id="title">Create New Trip</h3>
        <form className="create-form-container">
          <label className="required">Trip Name:
            <input type="text" name="name" onChange={this.setName} maxLength="40" required/>
          </label>
          <label className="required">Start Date:
            <DayPickerInput onDayChange={this.setStartDate}/>
          </label>
          <label className="required">End Date:
            <DayPickerInput onDayChange={this.setEndDate}/>
          </label>
        </form>
        <div className="create-btns">
          <Button colorClassName="btn-gray-background" label="Cancel" onButtonClick={this.props.hideModal}/>
          <Button label="Create" onButtonClick={this.onSave}/>
        </div>
      </div>
    )
  }
}

export default CreateNewTrip;
