import React from 'react'
import classes from './Input.css'
//import DatePickerCopy  from '../DatePicker/DatePicker'
import  DatePicker from "react-datepicker";
//import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import '../../../assets/global-styles/react-datepicker-cssmodules.css';
//import  "react-datepicker/dist/react-datepicker.css";
import ReactSelect from 'react-select'
import _ from 'lodash'
const input = (props) =>{
    let el = null
    const inputClasses=[classes.InputElement]
    let validationError = null;
    if (props.inValid && props.shouldValidate && props.touched){
            inputClasses.push(classes.Invalid)
            validationError = <p>Please enter a valid value!</p>;
    }
    const DATE_FORMAT = 'DD.MM.YYYY'
    switch (props.elementType) {
        case ('input'):
            el = <input className={inputClasses.join(' ')}
             {...props.elementConfig}
              value={props.value} 
              onChange={props.changed}
              />
            break;
        case ('textarea'):
            el=<textarea  className={classes.InputElement}
             {...props.elementConfig}
              value={props.value} 
              onChange={props.changed}
              />
            break;
        case ('date'):             
        el=<DatePicker
            {...props.elementConfig}
            dateFormat={DATE_FORMAT}
             value={props.value} 
             onChange={props.changed}
             placeholderText={'__.__.____'}
             showYearDropdown
             showMonthDropdown
             />            
            break;
        case ('select'):
            // el=<select  
            // className={classes.InputElement}            
            // value={_}
            // onChange={(option) => props.changed(option)}
            // >
            // {props.elementConfig.options.map(op=><option key={op.id}>{op.value}</option>)}
            // </select>
            el=<ReactSelect
            key={props.value}
            value={_.get(props.elementConfig.options.filter(d=> d.value === props.value),0)}//,props.elementConfig.options[0]
            options={props.elementConfig.options}
            className={'Select'}
            classNamePrefix={'react-select'}
            onChange={props.changed}
          />
            break;    
        default: el = <input onChange={props.changed} className={classes.InputElement} {...props.elementConfig} value={props.value} />

    }
    return (
        <div  className={classes.Input}>
        <label  className={classes.Label}>{props.label}</label>
        {el}
        {validationError}
    </div>
    )
}
export default input