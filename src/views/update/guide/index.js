import React,{Component} from 'react'
import { Table ,Button, message, Popconfirm, Tag} from 'antd'
import { getGuiders, deleteGuider } from '@/server'

class GuiderLists extends Component {
  state = {
    data: [],
    currentPage: 1,
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
        dataIndex: 'photo',
        render: (text) => {
          return <img src={text} style={{maxWidth: '100px'}} />
        }
      }, 
      {
        title: '宣传语',
        dataIndex: 'title',
        render: (text) => {
          return text.map(
            (item, index) => {
                return (
                  <Tag color="#2db7f5" key={index}>{text[index]}</Tag> 
                )                 
            }
          )
        }
      },
      {
        title: '专属',
        dataIndex: 'field',
        render: (text) => {
          return text.map(
            (item, index) => {
                return (
                  <Tag color="#108ee9" key={index}>{text[index].title}：{text[index].content}</Tag> 
                )                 
            }
          )
        }
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
    getGuiders(params).then(res => {
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
    deleteGuider(values).then(res => {
      message.success("删除成功")
      this.getList();
    })
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
    let { columns, data, loading, pagination} = this.state;
    let { handlePage } = this;
    let pageConfig = Object.assign({},pagination, {
      onChange: handlePage
    })
    return (
      <div className='shadow-radius'>
          <Table
              bordered
              columns={columns}
              dataSource={data}
              pagination={pageConfig}
              rowKey={row => row.id}
              loading={loading}
          />
      </div>
    )
  }
}

export default GuiderLists