import React from 'react';
import styles from "./button.css"

class Button extends React.Component {
  render() {
    const {
      label,
      onButtonClick
    } = this.props;

    return (
      <div className="btn-container">
        <button className="btn">
          {label}
        </button>
      </div>
    )
  }
}

export default Button;