import React from 'react'
import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'
const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        {/* <NavigationItem link="/" exact >Burger Builder</NavigationItem> */}
        {/* {props.isAuthinticated ? <NavigationItem link="/orders">Orders</NavigationItem> : null} */}
        {props.isAuthinticated ? <NavigationItem exact link="/tasks">Tasks</NavigationItem> : null}
        {
            !props.isAuthinticated ?
            <NavigationItem link="/auth">Authenticate</NavigationItem>
            :
            <NavigationItem link="/logout">Logout</NavigationItem>
        }
    </ul>

)
export default navigationItems