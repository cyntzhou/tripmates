import React from "react";

class EditActivityModal extends React.Component {
  render() {
    return (
      <div className="modal-container">
        <h3>Edit Activity</h3>
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
          <Button label="Cancel" onButtonClick={this.props.hideCreateModal}/>
          <Button label="Save" onButtonClick={this.onSave}/>
        </div>
      </div>
    )
  }
}

export default EditActivityModal;