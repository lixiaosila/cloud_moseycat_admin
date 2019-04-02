
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import Content from './Content'
import Header from './Header'
import Sider from './sider'
import Tabs from './tags'
import { debounce } from '@/utils'
import { changeIsMobile, changeCollapsed, getConfig } from '@/redux/actions'

class LayoutComponent extends Component {

  componentWillMount () {
    this.getClientWidth();
    // 节流函数
    window.onresize = debounce(this.getClientWidth, 100)
  }
  componentDidMount() {
    const { userInfo } = this.props;
    if(!userInfo.role) {
      this.getUserInfo()
    }
  }
  getUserInfo() {
    const { fetchUser } = this.props;
  }
  getClientWidth = () => {
    // 通过context上下文拿到store的dispatch事件,发起action修改store状态树
    const { changeCollapsed,changeIsMobile } = this.props, clientWidth = document.body.clientWidth;
    changeIsMobile(clientWidth <= 992)
    changeCollapsed(clientWidth <= 992)
  }
  render () {
    const {collapsed,isMobile} = this.props
    let marginLeft = collapsed ? 80 : 250;
    isMobile && (marginLeft=0);

    return (
      <Layout>
        <Sider />
        <Layout style={{ marginLeft,transition:'margin .2s'}}>
          <Header />
          <Tabs />
          <Content />
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = state => (
  {
    collapsed: state.UI.collapsed,
    isMobile: state.UI.isMobile,
    userInfo: state.user.userInfo
  }
)

const mapDispatchToProps = dispatch => ({
  changeCollapsed: playload => {
    dispatch(changeCollapsed(playload))
  },
  changeIsMobile:playload => {
    dispatch(changeIsMobile(playload))
  },
  fetchUser: playload => {
    dispatch(getConfig(playload))
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(LayoutComponent)
