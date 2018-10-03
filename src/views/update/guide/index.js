import React,{Component} from 'react'
import { Table ,Button, Input, message, Popconfirm} from 'antd'
import { addAdmin, deleteAdmin, putAdmin, getAdmin } from '@/server'
import AddForm from './addForm';

class ManagerToggle extends Component {
  state = {
    data: [],
    addable: false,
    currentPage: 1,
    totalPage: 1,
    pagination: {
      total: 1,
      current: 1,
      pageSize: 20
    },
    columns : [
      {
        title: '姓名',
        dataIndex: 'name',
      }, 
      {
        title: '头像',
        dataIndex: 'img',
      }, 
      {
        title: '宣传语',
        dataIndex: 'slogan',
      },
      {
        title: '专属',
        dataIndex: 'expert',
      },
      {
        title:'操作',
        dataIndex: 'control',
        width: '22%',
        render: (text,row,index) => {
            return (
              <div>
                <Button
                    ghost
                    onClick={this.handleEdit.bind(this, row)}
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
  
  handleEdit(row){
    this.props.history.push(`/update/custom/${row.id}`);
  }

  deleteRow(values) {
    deleteAdmin(values).then(res => {
      message.success("删除成功")
      this.getList();
    })
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
    let { addable, columns, data, loading, pagination} = this.state;
    let { handleAddConfirm, handleCancel, handleAdd, handlePage } = this;
    let pageConfig = Object.assign({},pagination, {
      onChange: handlePage
    })
    return (
      <div className='shadow-radius'>
          <Button type="primary" className="add_manage" onClick={handleAdd}>
            新增定制师
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