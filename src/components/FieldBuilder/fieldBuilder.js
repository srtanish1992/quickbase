import React, { Component } from 'react';
import './fieldBuilder.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SubmitButton from '../SubmitButton/submitButton';
import InputTextField from '../InputTextField/inputTextField';

import duplicate from '../../services/duplicate';
import FieldService from '../../services/mockServices';
import Cache from '../../services/cacheService';
// import { setTimeout } from 'timers';

class FieldBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            builderObject: {
                "label": '',
                "required": false,
                "default":'',
                "choices":[],
                "displayAlpha": true
            },
            labelRequired: false,
            duplicate: false,
            moreThanFifty: false,
            choiceRequired: false,
            loading: false
        }
    }

    /**
    * Returns string with highlights
    *
    * @param {String} value The string to to be highlighted.
    * @param {number} n The start index of the highlighted string.
    * @return {String} value string with highlights.
    */
    applyHighlights = (value, i) => {
        return value.substring(0,i) + 
            "<mark>" + 
            value.substring(i ,i + value.length) + 
            "</mark>" + value.substring(i + value.length);
    }

    /**
    * input change handler for adding validation - individual choice cannot be more than 4 charaters
    * it calls applyHighlights() to return highlighted string after 4th character
    *
    * @param {Object} e The event object.
    */
    handleChoiceChange = (e) => {
        let value = e.target.value;
        if (value.length > 4) {
            const highlightedText = this.applyHighlights(value, 5);
            document.getElementById('highlights').innerHTML = highlightedText;
        }
    }

    /**
    * takes the text value from choice input field and adds it to the choices array
    * does validations like if empty string, duplicate choices not allowed, not more than 50 choices allowed
    * also stores the builderObject state object in the localStorage
    */
    addChoice = () => {
        let stateCopy = this.state.builderObject;
        let choices = stateCopy.choices;
        let c = document.getElementById('choice-input');
        if (c.value === '') {
            this.setState({choiceRequired:true});
        } else {
            this.setState({choiceRequired:false});
            if (duplicate(choices,c.value)) {
                this.setState({duplicate:true});
            } else {
                if (choices.length <= 4) {
                    choices.push(c.value);
                    this.setState({
                        builderObject:stateCopy,
                        duplicate:false,
                        moreThanFifty: false
                    }, () => {
                        Cache.saveLocalData("formJson",stateCopy);
                    });
                    c.value = ''; 
                } else {
                    this.setState({
                        moreThanFifty:true,
                        duplicate:false,
                    });   
                }
            }
        } 
    }

    /**
    * removes a choice from the choices array in the builderObject state object
    *
    * @param {String} c The choice that needs to be removed.
    */
    removeChoice = (c) => {
        let stateCopy = this.state.builderObject;
        let result = stateCopy.choices.filter(choice => choice !== c);
        stateCopy.choices = [];
        stateCopy.choices.push(...result);
        this.setState({builderObject:stateCopy}, () => {
            Cache.saveLocalData("formJson",stateCopy);
        }); 
    }

    /**
    * input change handler for adding input values to their respective keys in builderObject state object
    * depending upon the name attribute
    * also stores the builderObject state object in the localStorage so that when someone accidentaly closes browser
    * then cache helps populate form data
    *
    * @param {Object} e The event object.
    */
    handleInputChange = (e) => {
        let stateCopy = this.state.builderObject;
        if (e.target.name === "label") {
            stateCopy["label"] = e.target.value;
        } else if (e.target.name === "required") {
            stateCopy["required"] = e.target.checked;
        } else {
            stateCopy["default"] = e.target.value;
        }

        Cache.saveLocalData("formJson",stateCopy);

        this.setState({
            builderObject:stateCopy
        });
    }

    /**
    * submits form data ( builderObject state object ) to the backend api 
    * does validations like if empty label input field, not more than 50 choices allowed, atleast one choide required
    * in the choices list
    * if the dfault choice value not present in choices list then add it to the list
    * if passed all validations then it disables all the input fields by toggling loading flag 
    * and  removing and adding events until successful post response received
    *
    */
    submitForm = () => {
        if (this.state.builderObject.label === '') {
            this.setState({labelRequired:true});
        } else {
            let stateCopy = this.state.builderObject;
            
            if (!duplicate(stateCopy.choices,stateCopy.default) && stateCopy.default !== ''){
                stateCopy.choices.push(stateCopy.default);
            } 

            if (stateCopy.choices.length > 5) {
                this.setState({moreThanFifty:true});
            } else {
                this.setState({
                    labelRequired:false,
                    moreThanFifty:false,
                    builderObject:stateCopy
                },() => {
                    if (this.state.builderObject.choices.length < 1) { 
                        this.setState({choiceRequired:true});
                    } else {  
                        
                        this.setState({
                            choiceRequired:false,
                            loading: true
                        }, () => {
                            const choices = document.getElementsByClassName('choice');
                            for (const c of choices) {
                                c.classList.add('removeEvent');
                            }
                        });

                        //  Faking API Call
                       
                            setTimeout(()=> {
                                this.setState({ loading: false }, () => {
                                     const choices = document.getElementsByClassName('choice');
                                     for (const c of choices) {
                                         c.classList.remove('removeEvent');
                                     }
                                })
                            }, 5000);
                        

                        // FieldService.saveField(this.state.builderObject)
                        // .then(() => this.setState({ loading: false }, () => {
                        //     const choices = document.getElementsByClassName('choice');
                        //              for (const c of choices) {
                        //                  c.classList.remove('removeEvent');
                        //              }
                        // }));
                    }
                });
            }    
        }
    }

    /**
    * clears the form data ( builderObject state to initial value ),
    * localStorage cache and sets validation flags to false
    *
    */
    clearForm = () => {
        Cache.clearLocalData("formJson");

        let stateCopy = this.state.builderObject;
        stateCopy["label"] ='';
        stateCopy["required"] = false;
        stateCopy["default"] = '';
        stateCopy["choices"] = [];
        this.setState({
            builderObject:stateCopy,
            labelRequired: false,
            duplicate: false,
            moreThanFifty: false,
            choiceRequired: false
        });
    }

    /**
    * gets the localstorage data after component mounted
    *
    */
    componentDidMount() {
        const cache = Cache.getLocalData("formJson");
        if (cache !== null && cache !== undefined) {
            this.setState({
                builderObject: cache
            });
        }
    }   

    render() {
        return (
            <div className = "field-container">
                <div id="heading">Field Builder</div>
                <Container>
                    <Row>
                        <Col lg={4} md={4} xs={12}>
                            <label className="label-text">Label</label>
                        </Col>
                        <Col lg={8} md={8} xs={12}>
                            <InputTextField
                                className="input-field"
                                name="label" 
                                value={this.state.builderObject.label} 
                                onChange={(e) => this.handleInputChange(e)} 
                                disabled={this.state.loading}
                                autoComplete="off"
                            />
                            {this.state.labelRequired && <div className="label-error">The Label field is required.</div>}                                  
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} md={4} xs={2}>
                            <label className="label-text">Type</label>
                        </Col>
                        <Col lg={8} md={8} xs={10}>
                            <label id="multi-select">Multi-select</label> 
                            <input 
                                id="check-box" 
                                type="checkbox" 
                                name="required" 
                                checked={this.state.builderObject.required} 
                                onChange={this.handleInputChange}
                                disabled={this.state.loading}
                            />
                            <label id="required-label">A Value is required</label>                                   
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} md={4} xs={12}>
                            <label className="label-text">Default Value</label>
                        </Col>
                        <Col lg={8} md={8} xs={12}>
                            <InputTextField
                                className="input-field"
                                name="default" 
                                value={this.state.builderObject.default} 
                                onChange={(e) => this.handleInputChange(e)}
                                autoComplete="off"
                                disabled={this.state.loading}
                            />                                 
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} md={4} xs={12}>
                        <label className="label-text">Choices</label>
                        </Col>
                        <Col lg={8} md={8} xs={12}>
                            <div>
                                {
                                    this.state.builderObject.choices.length > 0 && 
                                    this.state.builderObject.choices.map((c,index) => (
                                        <div className="choice" key={index} onClick={() => this.removeChoice(c)}>
                                        {c} <span id="cross" role="img" aria-label="Cross">&#10060;</span>
                                        </div>
                                    ))
                                }
                            </div>
                                <div className="backdrop">
                                    <div className="highlights" id ="highlights">  
                                    </div>
                                </div>    
                                <InputTextField 
                                    className="input-field" 
                                    type="text" 
                                    id="choice-input" 
                                    autoComplete="off"
                                    disabled={this.state.loading}
                                    onChange={this.handleChoiceChange}
                                    maxlength="23"
                                />
                            <div>
                                {this.state.duplicate && <div className="label-error">Duplicates choices are not allowed</div>}
                                {this.state.moreThanFifty && <div className="label-error">There cannot be more than 5 choices total.</div>}
                                {this.state.choiceRequired && <div className="label-error">Please enter atleast one choice.</div>}
                                <button 
                                    id="add-choice" 
                                    onClick={this.addChoice}
                                    disabled={this.state.loading}
                                >Add
                                </button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} md={4} xs={12}>
                            <label className="label-text">Order</label>       
                        </Col>
                        <Col lg={8} md={8} xs={12}>
                                <select className="select-field" name="order" disabled={this.state.loading}>
                                    <option value="true">Display choices in Alphabetical</option>
                                </select>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} md={4} xs={0}>
                            <div></div>
                        </Col>
                        <Col lg={8} md={8} xs={12}> 
                            <SubmitButton 
                                onClick={() => this.submitForm()}
                                loading={this.state.loading}
                            />
                            <span id ="or-text">Or</span>
                            <button id="clear-button" onClick={this.clearForm} disabled={this.state.loading}>Cancel</button>
                        </Col>
                    </Row>     
                </Container>    
            </div>
        )
    }
}

export default FieldBuilder;