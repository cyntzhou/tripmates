import React from "react";
import styles from "./nav-bar.css";
import { Link } from 'react-router-dom';

class Navbar extends React.Component {
  render() {
    return (
      <ul>
        <li><a class="active" href="/">Tripmates</a></li>
      </ul>
    )
  }
}

export default Navbar;