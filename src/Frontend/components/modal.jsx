import React from 'react';
import styles from "./modal.css"

class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleClose, show, children } = this.props;
    // const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
      <div className={show ? "modal display-block" : "modal display-none"}>
        <section className="modal-main">
          {children}
        </section>
      </div>
    );
  }
}

export default Modal;