import React from 'react'
import {Layout, Icon, Popover,Avatar,Dropdown,Menu,Badge} from 'antd'
import {connect} from 'react-redux'
import {changeCollapsed} from '@/redux/actions'
import {deleteToken} from '@/redux/actions'

import MenuList from './sider/Menu'
import './index.less'
const {Header} = Layout

const LayoutHeader = props => {

  const {collapsed, changeCollapsed, isMobile,deleteToken} = props
  // 获取用户信息，如果state树没有数据，则读取缓存

  const historyUserInfo = JSON.parse(localStorage.getItem('userInfo'));
  let userInfo = props.userInfo ? props.userInfo : historyUserInfo;
  userInfo.header =  "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2863156404,3882435418&fm=27&gp=0.jpg"

  if(!userInfo.role){
    
  }

  const handleLogout =() => deleteToken()


  const DropdownList = (
    <Menu>
      <Menu.Item key='user'>
        <Icon type='user'/>
         {userInfo.name}
      </Menu.Item>
      <Menu.Item
          disabled
          key='edit'
      >
        <Icon type='edit'/>
        个人设置
      </Menu.Item>
      <Menu.Item
          disabled
          key='setting'
      >
        <Icon type='setting'/>
        系统设置
      </Menu.Item>
      <Menu.Item
          key='logout'
          onClick={handleLogout}
      >
        <Icon type='logout'/>
          退出登录
      </Menu.Item>
    </Menu>
  )


  return (
    <Header>
      <div className='header-left'>
        {isMobile
          ? <Popover
              arrowPointAtCenter
              content={< MenuList />}
              placement='bottomLeft'
              trigger='click'
            >
              <span className='trigger-wrap'>
                <Icon
                    type={collapsed
                  ? 'menu-unfold'
                  : 'menu-fold'}
                />
              </span>
            </Popover>
          : <span className='trigger-wrap'
              onClick={changeCollapsed.bind(this, !collapsed)}
            >
            <Icon
                type={collapsed
              ? 'menu-unfold'
              : 'menu-fold'}
            />
          </span>
          }
      </div>

      <div className='header-right'>
        <div className='news-wrap'>
         <Badge count={userInfo.message}>
          <Icon
              style={{fontSize:'20px'}}
              type="bell"
          />
        </Badge>
        </div>
        <div className='dropdown-wrap'
            id='dropdown-wrap'
        >
          <Dropdown
              getPopupContainer={() => document.getElementById('dropdown-wrap')}
              overlay={DropdownList}
          >
            <div>
              <Avatar
                  size='large'
                  src={userInfo.header}
              />
              <Icon style={{color:'rgba(0,0,0,.3)'}}
                  type="caret-down"
              />
            </div>
          </Dropdown>
        </div>
      </div>

    </Header>
  )
}


const mapStateToProps = state => (
  {
    collapsed: state.UI.collapsed,
    isMobile: state.UI.isMobile,
    userInfo:state.user.userInfo
  }
)

const mapDispatchToProps = ({
  changeCollapsed: playload => {
    changeCollapsed(playload)
  },
  deleteToken:()=>deleteToken(),
})
export default connect(mapStateToProps, mapDispatchToProps)(LayoutHeader)
