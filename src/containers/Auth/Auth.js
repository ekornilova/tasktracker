import React, { Component } from 'react'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import classes from './Auth.css'
import * as actions from '../../store/actions/index'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Spinner from '../../components/UI/Spinner/Spinner'
class Auth extends Component {
    state = {
        isSignUp: true,
        controls: {
            email:{
                value: '',//'Kate',
                elementType: 'input',
                elementConfig:{
                    type:'text',
                    placeholder: 'Your email'
                },
                validation:{
                    required:true,
                    isEmail: true
                },
                touched: false,
                valid: false
            },
            password:{
                value: '',//'Kate',
                elementType: 'input',
                elementConfig:{
                    type:'text',
                    placeholder: 'Your password'
                },
                validation:{
                    required:true,
                    minLength: 6
                },
                touched: false,
                valid: false
            },
        }
    }

    checkValidaty(value,rules){
        let isValid= true
        if (!rules)
            return true
        if (rules.required){
            isValid = value.trim() !== '' && isValid
        }
        if (rules.minLength){
            isValid = value.length >= rules.minLength && isValid
        }
        if (rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid
        }
        return isValid

    }

    inputChangeHandler = (event, controlName) =>  {
        const updControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidaty(event.target.value,this.state.controls[controlName].validation),
                touched: true
            }
        }
        this.setState({
            controls: updControls,
        })        
    }
    onSubmitHandler = (event, isSignUp)=>{ 
        event.preventDefault()
        this.props.onAuth(this.state.controls.email.value,this.state.controls.password.value
            , isSignUp) //this.state.isSignUp
    }
    switchAuthModeHandler = ()=> {
        this.setState(prevState => {
            return {
                isSignUp: !prevState.isSignUp
            }
        }) 
    }
    componentDidMount(){
        if (this.props.authRedirectPath){
            this.props.onSetAuthRedirectPath()
        }
    }
    render() {
        const arr = Object.keys(this.state.controls).map(el => {return {
            config: this.state.controls[el],
            id: el}
        })
        let form = <Spinner />
        if (!this.props.loading){
            let formEls = arr.map(a => <Input key={a.id} 
                value={a.config.value}
                elementType={a.config.elementType} 
                elementConfig={a.config.elementConfig}
                changed={(event)=>this.inputChangeHandler(event,a.id)}
                shouldValidate={a.config.validation}
                inValid={!a.config.valid}
                touched={a.config.touched}
            />)
            form = <form onSubmit = {this.onSubmitHandler}>
                {formEls}
                <Button btnType='Success'
                clicked={(event) => this.onSubmitHandler(event, false)}
                >SIGN IN</Button>
                <Button
                clicked={(event) => this.onSubmitHandler(event, true)}
                btnType='Danger'>SIGN UP</Button>
            </form>
        }
        let errorMess = null
        if (this.props.error)
            errorMess = <p>{this.props.error.message}</p>
        let authRedirect = null
        if (this.props.isAuthinticated)
            authRedirect = <Redirect to={this.props.authRedirectPath}/>    
        return (
            <div className={classes.Auth}>
            {authRedirect}
            {errorMess}
                {form}
                {/* <Button btnType='Danger' clicked={this.switchAuthModeHandler}>SWITCH TO {this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'} </Button> */}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthinticated: state.auth.token !== null,
        authRedirectPath: state.auth.authRedirectPath

    }
}
const mapDispatchToProps= dispatch => {
    return {
        onAuth: (email, password,isSignUp) => dispatch(actions.auth(email, password,isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Auth)
