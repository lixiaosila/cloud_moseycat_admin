import React,{Component} from 'react'
import { Table ,Button, message, Popconfirm, Tag} from 'antd'
import { getScenes, deleteScene } from '@/server'

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
        title: '景点',
        dataIndex: 'title',
      }, 
      {
        title: 'banner',
        dataIndex: 'cover',
        render: (text) => {
          return <img src={text} style={{maxWidth: '100px'}} />
        }
      },
      {
        title: '价格',
        dataIndex: 'price',
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
    getScenes(params).then(res => {
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
    this.props.history.push(`/scene/custom/${row.id}`);
  }
  deleteRow(values) {
    deleteScene(values).then(res => {
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
  handleAdd = () => {
    this.props.history.push('/scene/custom/:id');
  }

  render() {
    let { columns, data, loading, pagination} = this.state;
    let { handlePage, handleAdd } = this;
    let pageConfig = Object.assign({},pagination, {
      onChange: handlePage
    })
    return (
      <div className='shadow-radius'>
          <Button type="primary" className="add_manage" onClick={handleAdd} style={{marginBottom: '20px'}}>
            新增景点
          </Button>
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