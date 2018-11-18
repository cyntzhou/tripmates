import React from "react";
import styles from "./edit-trip.css";
import Button from "../components/button.jsx";

class EditTripModal extends React.Component {
  constructor(props) {
    super();
    this.state = {
      nameValue: this.props.tripName,
      startValue: '',
      endValue: ''
    }

    // this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSave() {
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
            <input type="text" name="nameValue" placeholder={tripName} onChange={this.onChange}/>
          </label>
          <label>Start Date:
            <input type="text" name="startValue" placeholder={tripDate} onChange={this.onChange}/>
          </label>
          <label>End Date:
            <input type="text" name="endValue" placeholder={tripDate} onChange={this.onChange}/>
          </label>
        </form>
        <div className="trip-users">
          <i className="fa fa-users"/>
          {tripUsers}
        </div>
        <Button label="Cancel" onButtonClick={hideModal}/>
        <Button label="Save" onButtonClick={this.onSave}/>
      </div>
    )
  }
}

export default EditTripModal;