import React from "react";
import axios from "axios";
import styles from "./create-activity.css";
import Button from "../components/button.jsx";

class CreateActivityModal extends React.Component{
  constructor() {
    super()
    this.state = {
      name: '',
      category: null,
      suggestedHours: null,
      suggestedMins: null,
      address: null,
      openHours: null
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
      openHours
    } = this.state

    let placeId;
    if (address) {
      const placeBody = {address}
      axios.post('api/places', placeBody).then(res => {
        console.log(res)
        placeId = res.data.id;
      }).catch(err => console.log(err));
    } else {
      placeId = null;
    }

    let suggestedDuration = null;

    const bodyContext = {
      name,
      tripId: this.props.tripId,
      suggestedDuration,
      placeId,
      category
    }
    axios.post('/api/activities', bodyContext).then((res) => {
      this.props.hideCreateModal();
    }).catch(err => console.log(err));
  }

  render() {
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
          <label>Address:
            <input type="text" name="address" onChange={this.onChange}/>
          </label>
          <p>Open Hours:</p>
          <div>Put in calendar here</div>
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