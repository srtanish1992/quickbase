import React from 'react';
import '../InputTextField/inputTextField.css';

const InputTextField = (props) => {
    return (
        <input 
            id={props.id && props.id}
            className= {props.className && props.className}
            type={props.type && props.type}
            name={props.name && props.name} 
            value={props.value && props.value}
            onChange={ (e) => props.onChange && props.onChange(e)} 
            autoComplete={props.autoComplete && props.autoComplete}
            disabled={props.disabled && props.disabled}
            maxLength={props.maxlength && props.maxlength}
        />
    )
}

export default InputTextField;