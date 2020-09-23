import React,{ Component } from 'react';
import TableHeader from './TableParts/TableHeader'
import TableBody from './TableParts/TableBody'
import Aux from '../../../hoc/AuxHoc/AuxHoc'
import TableFilter  from './TableParts/TableFilter'
import cx from 'classnames'
import globalStyles from '../../../assets/global-styles/bootstrap.min.css'
import _ from 'lodash'
import moment from 'moment'
class Table extends Component {
  state = {
    data: [],
    columns: [],
    sortColumn: null
  }

  componentWillMount() {
    const { data, columns } = this.props;
    this.setState({ data, columns })
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    this.setState({ data })
  }
  sortData(arr,element, dir){
     return _.orderBy(arr,(el)=>{
      return element.type ==='date' ? moment(el[element.label],'DD.MM.YYYY') : 
      element.dict ? el[element.label] : el[element.label].toLowerCase()
    },dir)
  }

  onSortColumn = (element) =>{
    const newVal = !element.dir || element.dir === 'asc' ? 'desc' : 'asc'    
    this.setState({
      data: this.sortData(this.state.data,element,newVal),
      // _.orderBy(this.state.data,(el)=>{
      //   return element.type ==='date' ? moment(el[element.label],'DD.MM.YYYY') : 
      //   element.dict ? el[element.label] : el[element.label].toLowerCase()
      // },newVal),
      sortColumn: {
        ...element,
        dir: newVal
      }
    })
  }
  
  onFilterData = (filterForm)=>{
    const filterEls = Object.keys(filterForm)
    let newData = this.props.data.filter(el=>{
        let isAppropriate = true
        let i = 0
        while ((i < filterEls.length) && isAppropriate){
            const filterEl = filterForm[filterEls[i]]
            if (filterEl.value){
              if (filterEl.elementType === 'date'){
                  let [label, direct] = filterEls[i].split('_')
                  const filterDate = moment(filterEl.value, 'DD.MM.YYYY')
                  const dataDate = moment(el[label], 'DD.MM.YYYY')
                  isAppropriate = direct === 'to' ? filterDate.isSameOrAfter(dataDate) : filterDate.isSameOrBefore(dataDate)
              }
              else isAppropriate = filterEl.value === el[filterEls[i]]
              
            }
            i++
        }
        return isAppropriate
    })
    this.setState({
      data: newData
    })
  }
  onClearFilter = () => {
    let { sortColumn } = this.state
    const { data } = this.props 
    const newData = sortColumn ?
      this.sortData(data, sortColumn, sortColumn.dir) : data
    this.setState({
      data: newData
    })
  }
  render() {
    //
    return (//cx(classes.Table, globalStyles['table'])table-bordered
      <Aux>
        <TableFilter onFilter={this.onFilterData} onClearFilter={this.onClearFilter} filterData={this.props.filterData}/>
        <table className={cx(globalStyles['table'],globalStyles['table-bordered'],globalStyles['table-hover'])}>
          <TableHeader columns={this.state.columns} sortColumn={this.state.sortColumn} onSort={this.onSortColumn}/>
          <TableBody data={this.state.data} columns={this.props.columns} onRowClick={this.props.onRowClick} onRowDelete={this.props.onRowDelete}/>
        </table>
      </Aux>
      
    );
  }
}
export default Table