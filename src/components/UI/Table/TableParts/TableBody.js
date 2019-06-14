import React from 'react'
import dicts from '../../../../assets/dicts'
import _ from 'lodash'
const tableBody = (props) => {
  const { data, columns } = props
    return(
      <tbody> 
        {data.map((element, index) =>
          <tr key={element.id}   onClick={() => props.onRowClick(element.id)}>
          {columns.map(col => {
            let value
            if (col.dict){
              value = _.get(dicts[col.dict].filter(d=> d.value === element[col.label]),[0,'label'])
            }
            else value = element[col.label]
            return <td key={col.label}>{value}</td>
          }
              
            )}
            </tr>
        )}
      </tbody>
    )
  }
  export default tableBody