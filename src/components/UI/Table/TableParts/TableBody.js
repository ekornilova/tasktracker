import React from 'react'
import dicts from '../../../../assets/dicts'
import _ from 'lodash'
import Button from '../../Button/Button'
import classes from './../Table.css';

const tableBody = (props) => {
  const { data, columns } = props
  const onRowDelete = (id) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    props.onRowDelete(id)
  }
    return(
      <tbody> 
        {data.map((element, index) =>
          <tr key={element.id}   onClick={() => props.onRowClick(element.id)}>
          {columns.map((col, idxCol) => {
            let value
            if (col.dict){
              value = _.get(dicts[col.dict].filter(d=> d.value === element[col.label]),[0,'label'])
            }
            else value = element[col.label]
            return <td key={col.label}>
              <div className={classes.TableRow}>
              <div>{value}</div>
              {(idxCol === (columns.length-1)) && <Button btnType={['Danger', 'TableButton']} clicked={onRowDelete(element.id)}>DELETE</Button>}
              </div>
            
            </td>
          }
              
            )}
            </tr>
        )}
        
      </tbody>
    )
  }
  export default tableBody