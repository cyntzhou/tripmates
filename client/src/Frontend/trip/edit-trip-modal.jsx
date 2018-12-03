import React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import styles from "./edit-trip.css";
import Button from "../components/button.jsx";

var moment = require('moment');

class EditTripModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.trip.name,
      startDate: this.props.trip.startDate,
      endDate: this.props.trip.endDate,
      tripId: this.props.trip.tripId
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
      dateString = moment(null).format("YYYY-MM-DD")
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
    const {name, startDate, endDate, tripId} = this.state;
    if (moment(endDate).isAfter(startDate)) {
      const bodyContext = {newName: name, newStart: startDate, newEnd: endDate};
      axios.put(`/api/trips/${tripId}`, bodyContext).then(() => {
        this.props.hideModal();
      }).catch(err => {
        console.log(err);
        if (err.response.status === 403 || err.response.status === 404) {
          alert("You cannot update this trip since another user has deleted it.");
          this.props.hideModal();
          // TODO lead back to trips page? if doesn't already...
        }
      })
    } else {
      alert('please choose valid dates')
    }
  }

  onDelete = () => {
    const {tripId} = this.state
    axios.delete(`/api/trips/${tripId}`).then(() => {
      this.props.history.push('/trips');
    }).catch(err => {
      console.log(err);
      if (err.response.status === 403 || err.response.status === 404) {
        alert("Another user has already deleted this trip.");
        this.props.hideModal();
        // TODO lead back to trips page? if doesn't already...
      }
    })
  }

  render() {

    const {
      members,
      name,
      startDate,
      endDate
    } = this.props.trip;

    return (
      <div>
        <h3>Edit Trip Details</h3>
        <form>
          <label>Trip Name:
            <input type="text" name="name" onChange={this.setName} placeholder={name} maxLength="40"/>
          </label>
          <label>Start Date:
            <DayPickerInput onDayChange={this.setStartDate} value={startDate}/>
          </label>
          <label>End Date:
            <DayPickerInput onDayChange={this.setEndDate} value={endDate}/>
          </label>
        </form>
        <div className="trip-users">
          <i className="fa fa-users"/>
          {members}
        </div>
        <Button label="Cancel" onButtonClick={this.props.hideModal}/>
        <Button label="Save" onButtonClick={this.onSave}/>
        <Button label="Delete" onButtonClick={this.onDelete}/>
      </div>
    )
  }
}

export default withRouter(EditTripModal);
