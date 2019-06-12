import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import _ from 'lodash'
// fake data generator
// const getItems = (count, offset = 0) =>
//     Array.from({ length: count }, (v, k) => k).map(k => ({
//         id: `item-${k + offset}`,
//         content: `item ${k + offset}`
//     }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */


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
     width: '100%'//250
});
const listStyleInGeneral = {
    padding: grid,
    width: '30%',//250
    // height: '100%',
    // minHeight: '250px'
}
const labelStyle = {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '8px'
}
class DashBoard extends Component {
    state = {
        // items: getItems(10),
        // selected: getItems(5, 10),
        // picked: getItems(3, 15),
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
        const newData = {}
        columns.map(el=>_.set(newData,el.label,[]))
        data && data.map(d=>{
            const columnLabel =_.get(columns.filter(c=> c.id === d.status),[0,'label'])
            if (columnLabel)
                newData[columnLabel].push({
                    ...d,
                    content: d.name
                })
        })
        this.setState({
            columnsData: newData
        })
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
            // let state = { items };

            // if (source.droppableId === 'droppable2') {
            //     state = { selected: items };
            // }

            // if (source.droppableId === 'droppable3') {
            //     state = { picked: items };
            // }
            this.setState({columnsData: columnsDataNew});
        } else {
            const result = this.move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            // const data = {}
            this.state.columns.map(col=>{
                if (result[col.label]){
                    columnsDataNew[col.label] = result[col.label]
                }

            })
            // if (result.droppable)
            //     data.items = result.droppable
            // if (result.droppable2)
            //     data.selected = result.droppable2
            // if (result.droppable3)
            //     data.picked = result.droppable3
            // this.setState({
            //     ...data
            // });
            this.setState({columnsData: columnsDataNew});
        }
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (<div  style={{display: 'flex',
        justifyContent: 'space-between'}}>
            <DragDropContext onDragEnd={this.onDragEnd}>
            {
                this.state.columns.map(col=><div style={listStyleInGeneral}  key={col.id}>
                <label style={labelStyle}>{col.label.toUpperCase()}</label>    
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
              {/* <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                      <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {this.state.items.map((item, index) => (
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
                                      </div>
                                  )}
                              </Draggable>
                          ))}
                          {provided.placeholder}
                      </div>
                  )}
              </Droppable>
              <Droppable droppableId="droppable2">
                  {(provided, snapshot) => (
                      <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {this.state.selected.map((item, index) => (
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
                                      </div>
                                  )}
                              </Draggable>
                          ))}
                          {provided.placeholder}
                      </div>
                  )}
              </Droppable>
              <Droppable droppableId="droppable3">
                  {(provided, snapshot) => (
                      <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {this.state.picked.map((item, index) => (
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
                                      </div>
                                  )}
                              </Draggable>
                          ))}
                          {provided.placeholder}
                      </div>
                  )}
              </Droppable> */}
            </DragDropContext>
            </div>
        );
    }
}
export default DashBoard;