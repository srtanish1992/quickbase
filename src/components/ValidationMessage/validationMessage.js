import React from 'react';
import '../ValidationMessage/validationMessage.css';

const ValidationMessage = (props) => {
    if (props.valid) {
        return <div className="error-msg">{props.message}</div>
      }
      return null;
}

export default ValidationMessage;