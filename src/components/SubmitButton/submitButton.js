import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import '../SubmitButton/submitButton.css';

const SubmitButton = (props) => {

    return (
        <button id="save-button" onClick = {() => props.onClick()} disabled={props.loading}>
            { props.loading && <FontAwesomeIcon icon={faSpinner} size="lg" spin/> }
            <span>Save Changes</span>
        </button>
    )
}

export default SubmitButton;