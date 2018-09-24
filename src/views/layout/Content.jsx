import React from 'react'
import { Layout } from 'antd'
import { Redirect, withRouter, Route, Switch } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { routes } from '@/router'
import { connect } from 'react-redux'

const { Content } = Layout
class Main extends React.Component {

  handleFilter = permission => {
    let { userInfo } = this.props;
    let roles = userInfo.role;
    if(!permission || permission == roles ) return true
    return false
  }

  render () {
    const { handleFilter } = this;
    return (
      <TransitionGroup>
        <CSSTransition
            classNames="fade"
            key={location.pathname}
            timeout={500}
        >
          <Content style={{ margin: '12px 10px'}}>
            <Switch>
              {
                routes.map(ele => {
                  return handleFilter(ele.permission) && <Route
                      component={ele.component}
                      key={ele.path}
                      path={ele.path}
                      />
                })
              }
              <Redirect
                  from='/'
                  to='/error/404'
              />
  
            </Switch>
          </Content>
        </CSSTransition>
      </TransitionGroup>
    )
  }
}

const mapStateToProps = state => ({userInfo: state.user.userInfo})
export default withRouter(connect(mapStateToProps)(Main))
