import React from 'react'
import classes from './SideDrawer.css'
// import Logo from '../../Logo/Logo'
import NavigationItems from '../../Navigation/NavigationItems/NavigationItems'
import Backdrop from '../../UI/Backdrop/Backdrop'
import Aux from '../../../hoc/AuxHoc/AuxHoc'

const sideDrawer = (props) =>{
    let attachedClasses = [classes.SideDrawer, classes.Close]
    if (props.open)
        attachedClasses = [classes.SideDrawer, classes.Open]
    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.closed}/> 
            <div className={attachedClasses.join(' ')} onClick={props.closed}>
                <div  className={classes.Logo}>
                    
                </div>
                <nav>
                    <NavigationItems  isAuthinticated={props.isAuth} />
                </nav>
            </div>
        </Aux>
        
    )
}
export default sideDrawer