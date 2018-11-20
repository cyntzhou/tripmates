import React from "react";
import axios from "axios";
import Button from "../components/button.jsx";

class EditActivityModal extends React.Component {
  constructor() {
    super()
    this.state = {
      newName: null,
      newCategory: null,
      suggestedHours: null,
      suggestedMins: null,
      newAddress: null,
      newOpenHours: [],
    }
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSave = () => {
    const {
      newName,
      newCategory,
      suggestedHours,
      suggestedMins,
      newAddress,
    } = this.state
    let name, category, suggestedDuration, address

    if(newName) {
      name = newName;
    } else {
      name = this.props.activity.name;
    }

    if(newCategory) {
      category = newCategory;
    } else {
      category = this.props.activity.category;
    }

    if (suggestedHours || suggestedMins) {
      const hours = (suggestedHours * 60 || 0) ;
      suggestedDuration = parseInt(hours) + parseInt(suggestedMins || 0);
    } else {
      suggestedDuration = this.props.activity.suggestedDuration
    }

    const bodyContext = {
      name,
      tripId: this.props.tripId,
      suggestedDuration,
      placeId: null,
      category
    }

    if(newAddress) {
      const placeBody = {address: newAddress}
      if (this.props.activity.placeId) {
        axios.put(`/api/places/${this.props.activity.placeId}`, placeBody)
          .then(res => {
            bodyContext['placeId'] = res.data.insertId;
          })
      } else {
        axios.post('/api/places', placeBody).then(res => {
          bodyContext['placeId'] = res.data.insertId;
        }).catch(err => console.log(err));
      }
    } else {
      bodyContext['placeId'] = this.props.activity.placeId;
    }

    axios.put(`/api/activities/${this.props.activity.id}`)
      .then(() => {
        this.props.hideEditModal(null);
      }).catch(err => console.log(err));
  }

  onDelete = () => {
    axios.delete(`/api/activities/${this.props.activity.id}`).then(() => {
      this.props.hideEditModal(null);
    }).catch(err => console.log(err))
  }
  
  render() {
    return (
      <div className="modal-container">
        <h3>Edit Activity</h3>
        <form>
          <label>Activity Name:
            <input type="text" name="newName" onChange={this.onChange}/>
          </label>
          <h4>Optional Details</h4>
          <label>Category:
            <input type="text" name="newCategory" onChange={this.onChange}/>
          </label>
          <label>Suggested Duration:
            <input type="number" min="0" name="suggestedHours" placeholder="hours" onChange={this.onChange}/>
            <input type="number" min="0" name="suggestedMins" placeholder="mins" onChange={this.onChange}/>
          </label>
          <p>Place:</p>
          <label>Address:
            <input type="text" name="newAddress" onChange={this.onChange}/>
          </label>
          <p>Open Hours:</p>
          <div>Put in calendar here</div>
        </form>
        <div className="btns-container">
          <Button label="Cancel" onButtonClick={this.props.hideEditModal}/>
          <Button label="Save" onButtonClick={this.onSave}/>
          <Button label="Delete" onButtonClick={this.onDelete}/>
        </div>
      </div>
    )
  }
}

export default EditActivityModal;