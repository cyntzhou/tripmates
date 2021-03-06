import React from 'react';
import styles from "./button.css"

class Button extends React.Component {
  render() {
    const {
      colorClassName,
      label,
      onButtonClick
    } = this.props;

    const classNames = colorClassName ? "btn " + colorClassName : "btn btn-regular";

    return (
      <div className="btn-container">
        <button className={classNames} onClick={onButtonClick}>
          {label}
        </button>
      </div>
    )
  }
}

export default Button;