import React from "react";
import styles from "./create-trip.css";
import Button from "../components/button.jsx";

class CreateNewTrip extends React.Component {
  constructor() {
    super();
    this.state = {
      nameValue: '',
      startValue: '',
      endValue: ''
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSave() {
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
            <input type="text" name="startValue" placeholder="MM/DD/YYY" onChange={this.onChange}/>
          </label>
          <label>End Date:
            <input type="text" name="endValue" placeholder="MM/DD/YYY" onChange={this.onChange}/>
          </label>
        </form>
        <Button label="Cancel" onButtonClick={this.props.hideModal}/>
        <Button label="Save" onButtonClick={this.onSave}/>
      </div>
    )
  }
}

export default CreateNewTrip;