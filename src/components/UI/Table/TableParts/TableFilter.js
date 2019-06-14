import React, { Component } from 'react'
import Input from '../../Input/Input'
import _ from 'lodash'
import gs from '../../../../assets/global-styles/bootstrap.min.css'
import cx from 'classnames'
import moment from 'moment'
import classes from '../Table.css'
class TableFilter extends Component {
    state={
        filterForm:{},
        // filterForm:{
        //     status: {
        //         value: null,
        //         elementType: 'select',
        //         label: 'Status',
        //         elementConfig:{
        //             options: dicts['status']
        //         },
        //     },
        //     term_from: {
        //         value: null,
        //         elementType: 'date',
        //         label: 'Term From',

        //     },
        //     term_to: {
        //         value: null,
        //         elementType: 'date',
        //         label: 'Term To',
        //     },
        // },
        formIsValid: false
    }
    componentWillMount(){
        const { filterData } = this.props
        this.setState({
            filterForm: filterData
        })
    }
    formIsEmpty(filterForm){
        const els = Object.keys(filterForm)
        let i=0
        let isEmpty = true
        while (i<els.length && isEmpty){
            if (filterForm[els[i]].value)
                isEmpty = false
            i++
        }
        return isEmpty
      }
    
    inputChangeHandler = (event, idEl) =>  {
        let updatedFilterForm = { ...this.state.filterForm }        
        let updatedFilterFormEl = { ...updatedFilterForm[idEl] }
        const newValue = updatedFilterFormEl.elementType === 'date' ? 
        moment(event).format('DD.MM.YYYY') :
        updatedFilterFormEl.elementType === 'select' ? 
        _.get(event,'value')
        : _.get(event,'target.value')
        updatedFilterFormEl.value = newValue       
        updatedFilterForm[idEl] = updatedFilterFormEl    

        this.setState({
            filterForm: updatedFilterForm,
            formIsValid: newValue ? true : !this.formIsEmpty(updatedFilterForm)
        })        
    }
    clearFilter = (event) =>{
        event.preventDefault()
        let clearedFilterForm = { ...this.state.filterForm }
        for (let el in clearedFilterForm){
            clearedFilterForm[el].value=null
        }
        this.setState({
            filterForm: clearedFilterForm,
            formIsValid: false
        })  
        this.props.onClearFilter()

    }
    render(){
        const arr = Object.keys(this.state.filterForm).map(el => {return {
            config: this.state.filterForm[el],
            id: el}
        })
        return <form className={classes.TableFilter} >
        {
            arr.map(a=>
            <Input key={a.id}  
            value={a.config.value}
            elementType={a.config.elementType} 
            elementConfig={a.config.elementConfig}
            changed={(event)=>this.inputChangeHandler(event,a.id)}
            label={a.config.label}
            />)
        } 
        <button 
        disabled={!this.state.formIsValid}
        onClick={(event)=>{
            event.preventDefault()
            this.props.onFilter(this.state.filterForm)
        }}
        className={cx(gs['btn'],gs['btn-secondary'],classes.TableFilterButton)}
        >USE FILTER</button>
        <button 
        className={cx(gs['btn'],gs['btn-light'],classes.TableFilterButton)}
        onClick={this.clearFilter}
        disabled={!this.state.formIsValid}
        >CLEAR FILTER</button>
        </form>
    }

}
export default TableFilter