import React from "react";
import styles from "./create-activity.css";
import Button from "../components/button.jsx";

class CreateActivityModal extends React.Component{
  constructor() {
    super()
    this.state = {
      nameValue: '',
      categoryValue: '',
      suggestedHoursValue: '',
      suggestedMinsValue: '',
      addressValue: '',
      openHours: []
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSave() {

  }

  render() {
    return (
      <div className="modal-container">
        <h3>Create Activity</h3>
        <form>
          <label>Activity Name:
            <input type="text" name="nameValue" onChange={this.onChange}/>
          </label>
          <h4>Optional Details</h4>
          <label>Category:
            <input type="text" name="categoryValue" onChange={this.onChange}/>
          </label>
          <label>Suggested Duration:
            <input type="number" min="0" name="suggestedHoursValue" placeholder="hours" onChange={this.onChange}/>
            <input type="number" min="0" name="suggestedMinsValue" placeholder="mins" onChange={this.onChange}/>
          </label>
          <p>Place:</p>
          <label>Address:
            <input type="text" name="addressValue" onChange={this.onChange}/>
          </label>
          <p>Open Hours:</p>
          <div>Put in calendar here</div>
        </form>
        <div className="btns-container">
          <Button label="Cancel" onButtonClick={this.props.hideModal}/>
          <Button label="Save" onButtonClick={this.onSave}/>
        </div>
      </div>
    )
  }
}

export default CreateActivityModal;