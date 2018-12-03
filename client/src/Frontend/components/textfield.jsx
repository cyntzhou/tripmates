import React from "react";
import styles from "./textfield.css";

class TextField extends React.Component {
  constructor(props) {
    super(props);
  }
 
  render() {
    const {
      placeholder,
      onChange,
      value,
      maxLength,
      type
    } = this.props;
    const inputType = type ? type : "text";
    return (
      <input 
        className="textfield"
        type={inputType} 
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        maxLength={maxLength}
      />
    )
  }
};

export default TextField;