import React from 'react'
import classes from './Button.css'
const button = (props) => {
    const classesProps = typeof props.btnType === "object" ? props.btnType.map(item=>classes[item]).join(' ') : classes[props.btnType]
    return (
        <button 
        type='button'
        disabled={props.disabled}
        className={[classes.Button, classesProps].join(' ')} onClick={props.clicked}>{props.children}</button>
    )
}
export default button