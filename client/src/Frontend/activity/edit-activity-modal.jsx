import React from "react";
import axios from "axios";
import Button from "../components/button.jsx";

class EditActivityModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newName: null,
      newCategory: null,
      suggestedHours: null,
      suggestedMins: null,
      newPlaceName: null,
      newAddress: null,
      newOpenHours: [],
      currHours: Math.floor(this.props.activity.suggestedDuration/60),
      currMins: this.props.activity.suggestedDuration%60
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
      newPlaceName
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

    if(newAddress || newPlaceName) {
      let placeBody = {}

      if (newAddress) {
        placeBody['address'] = newAddress;
      } else if (newPlaceName) {
        placeBody['name'] = newPlaceName;
      }

      if (this.props.activity.placeId) {
        axios.put(`/api/places/${this.props.activity.placeId}`, placeBody)
          .then(res => {
            bodyContext['placeId'] = res.data.insertId;
            axios.put(`/api/activities/${this.props.activity.id}`, bodyContext)
            .then(() => {
              this.props.hideEditModal(null);
            }).catch(err => console.log(err));
          })
      } else {
        axios.post('/api/places', placeBody).then(res => {
          bodyContext['placeId'] = res.data.insertId;
          axios.put(`/api/activities/${this.props.activity.id}`, bodyContext)
          .then(() => {
            this.props.hideEditModal(null);
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
      }
    } else {
      bodyContext['placeId'] = this.props.activity.placeId;
      axios.put(`/api/activities/${this.props.activity.id}`, bodyContext)
      .then(() => {
        this.props.hideEditModal(null);
      }).catch(err => console.log(err));
    }
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
            <input 
              type="text" name="newName" 
              onChange={this.onChange} 
              placeholder={this.props.activity.name}
            />
          </label>
          <h4>Optional Details</h4>
          <label>Category:
            <input 
              type="text" 
              name="newCategory" 
              onChange={this.onChange}
              placeholder={this.props.activity.category? 
                this.props.activity.category : 'category'}
            />
          </label>
          <label>Suggested Duration:
            <input 
              type="number" min="0" 
              name="suggestedHours" 
              placeholder={`${this.state.currHours? this.state.currHours : ''} hours`}
              onChange={this.onChange}
            />
            <input 
              type="number" min="0" 
              name="suggestedMins" 
              placeholder={`${this.state.currMins? this.state.currMins : ''} mins`}
              onChange={this.onChange}
            />
          </label>
          <p>Place:</p>
          <label>Name:
            <input 
              type="text" 
              name="newPlaceName" 
              placeholder={this.props.address? this.props.address : 'address'}
              onChange={this.onChange}/>
          </label>
          <label>Address:
            <input 
              type="text" 
              name="newAddress" 
              placeholder={this.props.address? this.props.address : 'address'}
              onChange={this.onChange}/>
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