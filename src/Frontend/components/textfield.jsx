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
      value
    } = this.props;
    return (
      <input 
        className="textfield" 
        type="text" 
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    )
  }
};

export default TextField;