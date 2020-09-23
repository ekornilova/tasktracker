import * as actionTypes from '../actions/actionTypes'
const initialState = {
    tasks: [],
    loading: false,
    created:false,
    pickTask: null,
    view: 'table'
}
const reducer = (state = initialState, action) =>{
    switch (action.type) {
        case actionTypes.TASK_INIT:
            return {
                ...state,
                created: false,
            }
        case actionTypes.CREATE_TASK_SUCCESS:
            const newTask = {
                ...action.taskData,
                id: action.taskId,
                
            }
            let newTasks = [...state.tasks]
            if (action.updatedId){
                newTasks = state.tasks.filter(task=>task.id !== action.updatedId)
            }
            return {
                ...state,
                loading: false,
                created: true,
                tasks: newTasks.concat(newTask),
                pickTask: null
            }
            case actionTypes.DELETE_TASK_SUCCESS:
                const taskIdx = state.tasks.findIndex(taskItem => taskItem.id === action.taskId)
                const newTasksWithoutRemovindTask = [...state.tasks]
                if (taskIdx !== -1){
                    newTasksWithoutRemovindTask.splice(taskIdx,1)
                }
                return {
                    ...state,
                    loading: false,
                    tasks: newTasksWithoutRemovindTask,
                    pickTask: null
                }    
        case actionTypes.DELETE_TASK_FAILED:    
        case actionTypes.CREATE_TASK_FAILED:
            return {
                ...state,
                loading: false,
                error: action.error,
                pickTask: null
            }
        case actionTypes.DELETE_TASK_START:
        case actionTypes.CREATE_TASK_START:
            return {
                ...state,
                loading: true,
            }    
        case actionTypes.FETCH_TASKS_START:
            return {
                ...state,
                loading: true,
                created: false,
            } 
        case actionTypes.FETCH_TASKS_FAILED:
            return {
                ...state,
                loading: false,
            } 
        case actionTypes.FETCH_TASKS_SUCCESS:
            return {
                ...state,
                tasks: action.tasks,
                loading: false,
                pickTask: null
            }    
        case actionTypes.FETCH_PICKED_TASK_SUCCESS:
            return {
                ...state,
                pickTask: action.pickTask,
                loading: false,
            }  
        case actionTypes.CLEAR_TASK:
            return {
                ...state,
                pickTask: null
            }
        case actionTypes.CHANGE_VIEW:
            return {
                ...state,
                view: state.view === 'table' ? 'dash' : 'table',
                created: false
            }           
        default: return state
    }


} 
export default reducer