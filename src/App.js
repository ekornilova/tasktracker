import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import * as actions from './store/actions/index'
import asyncComponent from './hoc/asyncComponent/asyncComponent'

const asyncAuth = asyncComponent(() =>{
  return import('./containers/Auth/Auth')
}) 

const asyncLogout = asyncComponent(() =>{
  return import('./containers/Auth/Logout/Logout')
}) 

const asyncTasks = asyncComponent(() =>{
  return import('./containers/Tasks/Tasks')
}) 
const asyncTask = asyncComponent(() =>{
  return import('./containers/EditTask/EditTask')
}) 
class App extends Component {

  componentDidMount(){
    this.props.onTryAuth()
  }
  render() {
    let routes = (
      <Switch>
        <Route path='/auth' component={asyncAuth}/>
        <Route path='/' exact component={asyncAuth}/>
        <Redirect to='/'/>
      </Switch>
    )
    if (this.props.isAuthinticated){
      routes = (
        <Switch>  
            <Route path='/tasks' component={asyncTasks}/>
            <Route path='/newtask' component={asyncTask}/>
            <Route path='/task/:id' component={asyncTask}/>
            <Route path='/logout' component={asyncLogout}/>
            <Route path='/auth' component={asyncAuth}/>
            <Redirect to="/tasks" />
          </Switch>
      )
    }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      isAuthinticated: state.auth.token !== null
  }
}
const mapDispatchToProps= dispatch => {
  return {
      onTryAuth: () => dispatch(actions.authCheckState())

  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))

