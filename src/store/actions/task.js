import * as actionTypes from './actionTypes'
import axios from '../../axios'
import _ from 'lodash'
//import { fetchOrderSuccess } from './order';
export const createTaskSuccess = (id, taskData, updatedId) => {
    return {
        type: actionTypes.CREATE_TASK_SUCCESS,
        taskId: id,
        taskData: taskData,
        updatedId: updatedId
    }
}
export const createTaskFailed = (error) => {
    return {
        type: actionTypes.CREATE_TASK_FAILED,
        error: error,
    }
}

export const createTaskStart = () => {
    return {
        type: actionTypes.CREATE_TASK_START,
    }
}
export const clearTask = () => {
    return {
        type: actionTypes.CLEAR_TASK,
    }
}
export const createTask = (taskData, token) => {
    const taskId = taskData.taskId 
    return dispatch => {
        createTaskStart()        
        _.unset(taskData,'taskId')
        const request = taskId ? axios.put('/tasks/'+taskId +'.json?auth=' + token,taskData)  
        : axios.post('/tasks.json?auth=' + token,taskData)   
        //axios.post('/tasks.json?auth=' + token,taskData)
        request
        .then(response => {
            dispatch(createTaskSuccess(response.data.name, taskData, taskId))
        }) 
        .catch(error => {
            dispatch(createTaskFailed(error))
        })
    }

}
export const taskInit = () => {
    return {
        type: actionTypes.TASK_INIT
    }
}
export const changeView = () => {
    return {
        type: actionTypes.CHANGE_VIEW
    }
}

export const fetchTaskSuccess = (tasks) => {
    return {
        type: actionTypes.FETCH_TASKS_SUCCESS,
        tasks: tasks
    }
}
export const fetchPickedTaskSuccess = (task) => {
    return {
        type: actionTypes.FETCH_PICKED_TASK_SUCCESS,
        pickTask: task
    }
}
export const fetchTaskFail = (error) => {
    return {
        type: actionTypes.FETCH_TASKS_FAILED,
        error: error
    }
}

export const fetchTaskStart = () => {
    return {
        type: actionTypes.FETCH_TASKS_START,
    }
}
export const fetchPickedTask = (token, taskId) => {
    return dispatch => {
        dispatch(fetchTaskStart())
        const queryParams = '?auth=' + token + '&orderBy="$key"&equalTo="' + taskId + '"'
        axios.get('/tasks.json' + queryParams).then(response => {
            const fetchedTasks = []
            for (let key in response.data){
                fetchedTasks.push( {
                    ...response.data[key],
                    id: key
                })
            }
            dispatch(fetchPickedTaskSuccess(fetchedTasks[0]))
        })
        .catch(errorr=>dispatch(fetchTaskFail(errorr))
            )
    }
}

export const fetchTasks = (token, userId) => {
    return dispatch => {
        dispatch(fetchTaskStart())
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"'
        axios.get('/tasks.json' + queryParams).then(response => {
            const fetchedTasks = []
            for (let key in response.data){
                fetchedTasks.push( {
                    ...response.data[key],
                    id: key
                })
            }
            dispatch(fetchTaskSuccess(fetchedTasks))
        })
        .catch(errorr=>dispatch(fetchTaskFail(errorr))
            )
    }
}