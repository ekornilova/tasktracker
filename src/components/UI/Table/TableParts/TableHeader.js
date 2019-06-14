import React from 'react'
import gs from '../../../../assets/global-styles/bootstrap.min.css'

import classes from '../Table.css'

const tableHeader = (props) => {
  const { sortColumn } = props
    return(
      <thead className={gs['bg-info']}>
        <tr>
          {props.columns.map((element, index) =>
            {
              let styleIcon = {transform: ' rotateX(180deg)'}
              let pickedEl = element
              if (sortColumn && sortColumn.label === element.label){
                pickedEl = sortColumn
                if (sortColumn.dir === 'desc')
                  styleIcon={}
              }
              return <th key={index}>
              <img className={classes.Icon}
              alt='sort_img'
              onClick={()=>props.onSort(pickedEl)}
               src={require('./assets/sort-asc.png')}
              style={styleIcon}
              />
              {element.label}            
              </th>
            }
          )}
        </tr>
      </thead>
    )
  }
  export default tableHeader