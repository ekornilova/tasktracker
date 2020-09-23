import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classes from './DashBoard.css'
import Button from '../../UI/Button/Button'
import _ from 'lodash'

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};


const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',//grey

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
     padding: grid,
     height: '100%',
     width: '100%',
     minHeight: 'inherit'
});
const listStyleInGeneral = {
    padding: grid,
    width: '30%',//250
    height: '100%',
     minHeight: '250px'
}
const getColumnData = ( data, columns ) => {
    const newData = {}
    columns.map(el=>_.set(newData,el.label,[]))
    data && data.forEach(d=>{
        const columnLabel =_.get(columns.filter(c=> c.id === d.status),[0,'label'])
        if (columnLabel)
            newData[columnLabel].push({
                ...d,
                content: d.name
            })
    })
    return newData
}
class DashBoard extends Component {
    state = {
        columns:[
            {id: 1, label: 'planned'},
            {id: 2, label: 'process'},
            {id: 3, label: 'ready'}
        ],
        columnsData:{}
    };

    move(source, destination, droppableSource, droppableDestination){
          const sourceClone = Array.from(source);
          const destClone = Array.from(destination);
          const [removed] = sourceClone.splice(droppableSource.index, 1);
          const newValueId = _.get(this.state.columns.filter(c=>c.label === droppableDestination.droppableId),
          [0,'id'])
          this.props.onChange(removed,newValueId)
          destClone.splice(droppableDestination.index, 0, removed);
      
          const result = {};
          result[droppableSource.droppableId] = sourceClone;
          result[droppableDestination.droppableId] = destClone;
      
          return result;
      };
       
    componentWillMount(){
        const { data } = this.props 
        const { columns } = this.state 
        this.setState({
            columnsData: getColumnData(data, columns)
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.data!==this.props.data){
            this.setState({
                columnsData: getColumnData(nextProps.data, this.state.columns)
            })
        }
      }
    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
        droppable: 'items',
        droppable2: 'selected',
        droppable3: 'picked'
    };

    // getList = id => this.state[this.id2List[id]];
    getList = id => this.state.columnsData[id];
    
    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        let columnsDataNew = {...this.state.columnsData}
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );
            
            columnsDataNew[source.droppableId] = items
            this.setState({columnsData: columnsDataNew});
        } else {
            const result = this.move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            this.state.columns.forEach(col=>{
                if (result[col.label]){
                    columnsDataNew[col.label] = result[col.label]
                }

            })
            this.setState({columnsData: columnsDataNew});
        }
    };
    onTaskDelete = (taskId) => () => {
        this.props.onDeleteTask(taskId)
    }
    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (<div  style={{display: 'flex',
        justifyContent: 'space-between'}}>
            <DragDropContext onDragEnd={this.onDragEnd}>
            {
                this.state.columns.map(col=><div  
                style={listStyleInGeneral}  
                key={col.id}>
                <label className={classes.Label}>{col.label.toUpperCase()}</label>    
                <Droppable droppableId={col.label}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}>
                        {this.state.columnsData[col.label].map((item, index) => (                            
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}>
                                        {item.content}
                                        <p>Term: {item.term}</p>
                                        <Button 
            btnType='Danger'
            clicked={this.onTaskDelete(item.id)}
            >DELETE</Button>

                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            </div>)
            }
            </DragDropContext>
            </div>
        );
    }
}
export default DashBoard;