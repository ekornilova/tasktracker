import React, { Component } from 'react';
import { connect } from 'react-redux'
import Button from '../../components/UI/Button/Button'
import classes from './EditTask.css'
import Spinner from '../../components/UI/Spinner/Spinner'
import Input from '../../components/UI/Input/Input'
import * as taskActions from '../../store/actions/task'
import { Redirect } from 'react-router-dom';
import _ from 'lodash'
import moment from 'moment'
import dicts from '../../assets/dicts'
class EditTask extends Component {
    state= {
        name: '',
        description:'',
        term:'',
        plannedTime: '',
        closeForm: false,
        taskForm:{
                name:{
                    value: '',//'Kate',
                    label: 'Task Header',
                    elementType: 'input',
                    elementConfig:{
                        type:'text',
                        placeholder: 'Task Header'
                    },
                    validation:{
                        required:true,
                        minLength: 5,
                    },
                    touched: false,
                    valid: false
                },
                description:{
                    value: '',//'Kate',
                    label: 'Description',
                    elementType: 'textarea',
                    elementConfig:{
                        type:'text',
                        placeholder: 'Description'
                    },
                    validation:{
                        required:true,
                        minLength: 5,
                    },
                    touched: false,
                    valid: false
                },
                status:{
                    value: 1,//''Fuchika',
                    elementType: 'select',
                    label: 'Status',
                    elementConfig:{
                        options: dicts['status']
                    },
                    valid: true
                },
                priority:{
                    value: 1,//''Fuchika',
                    elementType: 'select',
                    label: 'Priority',
                    elementConfig:{
                        options: dicts['priority']
                    },
                    valid: true
                },
                term:{
                    value: '',//'Kate',
                    elementType: 'date',
                    label: 'Term',
                    elementConfig:{
                        type:'text',
                        placeholder: 'Term'
                    },
                    validation:{
                        required:true,
                        minLength: 5,
                    },
                    touched: false,
                    valid: false
                },
                plannedTime:{
                    value: '',//'Kate',
                    elementType: 'input',
                    label: 'Planned Time',
                    elementConfig:{
                        type:'text',
                        placeholder: 'Planned Time in hours'
                    },
                    validation:{
                        required:true,
                        minLength: 5,
                    },
                    touched: false,
                    valid: false
                },
                   
        },
        //loading: false,
        formIsValid: false
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

    taskHandler = (event) => {
        event.preventDefault()
        //this.setState({ loading: true })
        const formData ={}
        for (let el in this.state.taskForm) {
            formData[el] = this.state.taskForm[el].value
        }
        const task = {
            taskData:formData,
            userId: this.props.userId,
            taskId: this.state.taskId
        }
        this.props.onCreateTask(task, this.props.token)
        //this.props.onCloseForm()
    }
    inputChangeHandler = (event, idEl) =>  {       
        let updatedTaskForm = { ...this.state.taskForm }        
        let updatedTaskFormEl = { ...updatedTaskForm[idEl] }
        const newValue = updatedTaskFormEl.elementType === 'date' ? 
        moment(event).format('DD.MM.YYYY') :
        updatedTaskFormEl.elementType === 'select' ? 
        _.get(event,'value')
        : _.get(event,'target.value')
        updatedTaskFormEl.value = newValue
        updatedTaskFormEl.valid = this.checkValidaty( newValue,updatedTaskFormEl.validation )
        updatedTaskFormEl.touched = true        
        updatedTaskForm[idEl] = updatedTaskFormEl    
        let formIsValid = true 
        for (let el in updatedTaskForm){
            formIsValid = updatedTaskForm[el].valid && formIsValid
        }    
        this.setState({
            taskForm: updatedTaskForm,
            formIsValid: formIsValid
        })        
    }
    componentWillMount(){
    }
    componentWillReceiveProps(nextProps){
        const taskId = _.get(this.props, 'match.params.id')
        if (taskId && !this.props.pickTask && nextProps.pickTask){            
            const { pickTask } = nextProps
            let taskForm = this.state.taskForm
                Object.keys(pickTask.taskData).map(el=>{
                    taskForm[el].value = pickTask.taskData[el]
                    taskForm[el].valid = true
                }) 
                this.setState({
                    taskForm: taskForm,
                    formIsValid: true,
                    taskId: taskId
                })
        }
    }
    componentDidMount(){        
        const taskId = _.get(this.props, 'match.params.id')
        if (taskId){
            this.props.onFetchPickTask(this.props.token,taskId)
        }       
    }
    onCancel = () =>{
        this.setState({closeForm: true})
        this.props.onCloseForm()
    }
    render(){
        const arr = Object.keys(this.state.taskForm).map(el => {return {
            config: this.state.taskForm[el],
            id: el}
        })
        const redirectToTasks = this.props.created || this.state.closeForm ? <Redirect to='/tasks'/> : null
        let form = (<form onSubmit={this.taskHandler}>
               {
                   arr.map(a=>
                   <Input key={a.id}  
                   value={a.config.value}
                   elementType={a.config.elementType} 
                   elementConfig={a.config.elementConfig}
                   changed={(event)=>this.inputChangeHandler(event,a.id)}
                   shouldValidate={a.config.validation}
                   inValid={!a.config.valid}
                   touched={a.config.touched}
                   label={a.config.label}
                   />)
               } 
            
            <Button btnType='Success' disabled={!this.state.formIsValid} clicked = {this.taskHandler}>
                {this.state.taskId ? 'SAVE' : 'CREATE'}
            </Button>
            {this.state.taskId && <Button 
            btnType='Danger'
            clicked={this.onCancel}
            >CANCEL</Button>}
        </form>)
        if (this.props.loading)
            form = <Spinner />
       return (
           <div className={classes.EditTask}>
                {redirectToTasks}
               {form}
           </div>
       ) 
    }
}
const mapStateToProps = state => {
    return {
        token: state.auth.token,
        userId: state.auth.userId,
        loading: state.task.loading,
        created: state.task.created,
        pickTask: state.task.pickTask,
    }
}
const mapDispatchToProps= dispatch => {
    return {
        onCreateTask: (taskData,token) => dispatch(taskActions.createTask(taskData,token)),
        onFetchPickTask: (token,taskId) => dispatch(taskActions.fetchPickedTask(token, taskId)),
        onCloseForm: () => dispatch(taskActions.clearTask()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditTask)