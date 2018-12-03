import React from 'react';
import styles from "./add-button.css"

class AddButton extends React.Component {
  render() {
    const {onButtonClick} = this.props;
    return (
      <div className="btn-container">
        <button className="add-btn" onClick={onButtonClick}>
          <i className="fa fa-plus"/>
        </button>
      </div>
    )
  }
}

export default AddButton;