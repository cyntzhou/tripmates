import React from 'react';
import styles from "./not-found.css"

class NotFound extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { message } = this.props;
    return (
      <div className="not-found">
        <h2>Page not found</h2>
        <p>
        { message }
        </p>
      </div>
    );
  }
}

export default NotFound;