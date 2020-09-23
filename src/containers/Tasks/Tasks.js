import React, { Component } from 'react'
import axios from '../../axios'
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler'
import { connect } from 'react-redux'
import * as taskActions from '../../store/actions/index'
import Aux from '../../hoc/AuxHoc/AuxHoc'
import Spinner from '../../components/UI/Spinner/Spinner'
import Table from '../../components/UI/Table/Table'
import gs from '../../assets/global-styles/bootstrap.min.css'
import cx from 'classnames'
import dicts from '../../assets/dicts'
import DashBoard from '../../components/UI/DashBoard/DashBoard'

const TABLE_COLUMNS = [
    {
      label: 'name',
      sort: 'default',
      //dir: 'asc'
    },
    {
      label: 'status',
      sort: 'default',
      dict:'status',
      //dir: 'asc'
    },
    {
      label: 'priority',
      sort: 'default',
      dict:'priority',
      //dir: 'asc'
    },
    {
        label: 'term',
        sort: 'default',
        type: 'date',
       // dir: 'asc'
      },
  ];
  const FILTER_FORM = {
    status: {
        value: null,
        elementType: 'select',
        label: 'Status',
        elementConfig:{
            options: dicts['status']
        },
    },
    term_from: {
        value: null,
        elementType: 'date',
        label: 'Term From',

    },
    term_to: {
        value: null,
        elementType: 'date',
        label: 'Term To',
    },
}

class Tasks extends Component {
    state = {
        tasks: [],
        loading: true,
        view: 'table'
    }
    componentDidMount(){
        this.props.onFetchTasks(this.props.token, this.props.userId)
    }

    createTask = () => {
        this.props.onInitTask()
        this.props.history.push({
            pathname: '/newtask',
        })
    }
    clickTask = (id) =>{
        this.props.history.push({
            pathname: '/task/' + id,
        })
    }

    onChangeStatus = (el, newStatus) => {
        let task = this.props.tasks.filter(t=>t.id===el.id )[0]
        task.taskData.status = newStatus
        this.props.onEditTaskStatus({
            ...task,
            taskId: el.id 
        }, this.props.token)
    }
    onDeleteTask = (taskId) => {
        this.props.onDeleteTask(taskId, this.props.token)
    }

    render(){
        const { view } = this.props
        let tasks = <Spinner />
        if (!this.props.loading){
            if (view === 'table'){
                tasks = <Table columns={TABLE_COLUMNS} data={this.props.tasks.map(el=>{
                    return {
                        id: el.id,
                        ...el.taskData
                    }
                })} 
                filterData={FILTER_FORM}
                onRowClick={this.clickTask}
                onRowDelete={this.onDeleteTask}
                />
            }
            else {
                tasks = <DashBoard
                onChange={this.onChangeStatus}
                onDeleteTask={this.onDeleteTask}
                data={this.props.tasks.map(el=>{
                    return {
                        id: el.id,
                        ...el.taskData
                    }
                })} 
                 />
            }
            
        }
        return <Aux>
            <div style={{display: 'flex', margin: '1%'}}>
                <button 
                className={cx(gs['btn'],gs['btn-secondary'])}
                onClick={this.createTask}
                >CREATE TASK</button>
                <div  style={{display: 'flex', marginLeft: '76%'}}>
                <button 
                    className={cx(gs['btn'],gs[ view === 'table' ? 'btn-primary' : 'btn-secondary'])}
                disabled={view === 'table'} 
                onClick={this.props.onChangeView}
                >TABLE</button>
                <button 
                className={cx(gs['btn'],gs[view === 'dash' ? 'btn-primary' : 'btn-secondary'])}
                onClick={this.props.onChangeView}
                disabled={view === 'dash'} 
                >DASHBOARD</button>
                </div>
        </div>
            {tasks}
        </Aux>
    }
}
const mapStateToProps = state => {
    return {
        token:  state.auth.token,
        userId: state.auth.userId,
        tasks: state.task.tasks,
        loading: state.task.loading,
        view: state.task.view,
    }
}
const mapDispatchToProps= dispatch => {
    return {
        onFetchTasks: (token,userId) => dispatch(taskActions.fetchTasks(token, userId)),        
        onInitTask: () => dispatch(taskActions.taskInit()),
        onChangeView: () => dispatch(taskActions.changeView()),
        onEditTaskStatus:(taskData,token) => dispatch(taskActions.createTask(taskData,token)),
        onDeleteTask: (taskId, token) => dispatch(taskActions.deleteTask(taskId, token))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Tasks,axios))
