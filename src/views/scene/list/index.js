import React,{Component} from 'react'
import { Table ,Button, Input, message, Popconfirm} from 'antd'
import { addAdmin, deleteAdmin, putAdmin, getAdmin } from '@/server'
import AddForm from './addForm';

class ManagerToggle extends Component {
  state = {
    data: [],
    editable: false,
    addable: false,
    currentPage: 1,
    totalPage: 1,
    currentData: {},
    pagination: {
      total: 1,
      current: 1,
      pageSize: 20
    },
    columns : [
      {
        title: '姓名',
        dataIndex: 'name',
      }, {
        title: '手机号',
        dataIndex: 'mobile',
      }, {
        title: '角色',
        dataIndex: 'email',
        render: (text,row,index) => {
          return (
            row.role == 'super' ? <span>超级管理员</span> : <span>管理员</span>
          )
        }
      },{
        title:'操作',
        dataIndex: 'control',
        width: '22%',
        render: (text,row,index) => {
            return (
              <div>
                <Button
                    ghost
                    onClick={this.setEditable.bind(this, row, text)}
                    style={{marginRight:12}}
                    type='primary'
                >编辑</Button>
                <Popconfirm
                    onConfirm={() => this.deleteRow(row)}
                    title="确认删除?"
                >
                  <Button
                      ghost
                      style={{marginRight:0}}
                      type='danger'
                  >删除</Button>
                </Popconfirm>
              </div>
            )
        }
      }
    ]
  }
  componentDidMount() {
    this.getList();
  }
  getList(page = 1) {
    let params = {
      page: page
    }
    this.setState(
      {
        loading: true
      }
    )
    getAdmin(params).then(res => {
      this.setState(
        {
          data: res.data.list,
          loading: false,
          pagination: {
            total: res.data.total,
            current: this.state.currentPage,
            pageSize: 20
          }
        }
      )
    })
  }
  
  setEditable(row){
    this.setState(
      {
        editable: true,
        currentData: row
      }
    )
  }

  deleteRow(values) {
    deleteAdmin(values).then(res => {
      message.success("删除成功")
      this.getList();
    })
  }
  
  handleEditConfirm = (values) =>{
    let { currentData } = this.state;
    let params = Object.assign({}, currentData, values);

    putAdmin(params).then(
      res => {
        this.getList();
        message.success("更新成功");
      }
    )
    this.handleCancel();
  }

  handleAddConfirm = (values) =>{
    let params = Object.assign({}, values);

    addAdmin(params).then(
      res => {
        this.getList();
        message.success("新增管理员成功");
      }
    )
    this.handleCancel();
  }

  handleCancel = () => {
    this.setState(
      {
        editable: false,
        addable: false
      }
    )
  }

  handleAdd = () => {
    this.setState(
      {
        addable: true
      }
    )
  }

  handlePage = (currentPage) => {
    this.setState(
      {
        currentPage: currentPage
      }
    )
    this.getList(currentPage)
  }

  render() {
    let { editable, addable, columns, data, currentData, loading, pagination} = this.state;
    let { handleEditConfirm, handleAddConfirm, handleCancel, handleAdd, handlePage } = this;
    let pageConfig = Object.assign({},pagination, {
      onChange: handlePage
    })
    return (
      <div className='shadow-radius'>
          <Button type="primary" className="add_manage" onClick={handleAdd}>
            新增旅游景点
          </Button>
          <Table
              bordered
              columns={columns}
              dataSource={data}
              pagination={pageConfig}
              rowKey={row => row.id}
              loading={loading}
          />
          <AddForm visible={addable} onConfirm={handleAddConfirm} onCancel={handleCancel} />
      </div>
    )
  }
}

export default ManagerToggle