import React,{Component} from 'react'
import { Table ,Button, Input, message, Popconfirm } from 'antd'
import { getTravels, putTravels, deleteTravels } from '@/server'
import EditForm from './editForm';

const Search = Input.Search;

class TableEdit extends Component {
  state = {
    data: [],
    editable: false,
    currentPage: 1,
    loading: false,
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
        title: '目的地',
        dataIndex: 'place'
      },{
        title: '定制需求',
        dataIndex: 'remark',
        width: '22%'
      },{
        title: '状态',
        dataIndex: 'status',
        render: (text,row,index) => {
          return (
            <span>
              {row.status == 0 ? "进行中" : row.status == 1 ? "已完成" : "取消"}
            </span>
          )
        }
      },{
        title:'操作',
        dataIndex: 'control',
        width: '30%',
        render: (text,row,index) => {
            return (
              <div>
                <Button
                    ghost
                    onClick={this.setEditable.bind(this, row, text)}
                    style={{marginRight:6}}
                    type='primary'
                >修改</Button>
                <Popconfirm
                    onConfirm={() => this.deleteRow(row)}
                    title="确认删除?"
                >
                  <Button
                      ghost
                      style={{marginRight:6}}
                      type='danger'
                  >删除</Button>
                </Popconfirm>
                <Button
                    ghost
                    onClick={this.cancel.bind(this, row, text)}
                    style={{marginRight:6}}
                    type='primary'
                >取消</Button>
                <Button
                    ghost
                    onClick={this.finish.bind(this, row, text)}
                    style={{marginRight:0}}
                    type='primary'
                >已完成</Button>
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
    getTravels(params).then(res => {
      this.setState(
        {
          data: res.data.list,
          loading: false,
          pagination: {
            total: res.data.total,
            current: this.state.currentPage,
            pageSize: 20,
          }
        }
      )
    })
  }
  // 点击修改时，将当前行改成可编辑状态,并将当前Input的值修改为当前行name的值
  setEditable(row){
    this.setState(
      {
        editable: true,
        currentData: row
      }
    )
  }
  cancel(row) {
    // status 为2代表取消
    let params = Object.assign({}, row, {status: 2});

    putTravels(params).then(
      res => {
        this.getList();
        message.success("取消成功");
      }
    )
  }

  finish(row) {
    // status 为1代表wanc
    let params = Object.assign({}, row, {status: 1});

    putTravels(params).then(
      res => {
        this.getList();
        message.success("更新成功");
      }
    )
  }

  deleteRow(values) {
    deleteTravels(values).then(
      res => {
        this.getList();
        message.success("删除成功");
      }
    )
  }
  
  handleConfirm = (values) =>{
    let { currentData } = this.state;
    let params = Object.assign({}, currentData, values);

    putTravels(params).then(
      res => {
        this.getList();
        message.success("更新成功");
      }
    )
    this.handleCancel();
  }
  handleCancel = () => {
    this.setState(
      {
        editable: false
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
    let { editable, columns, data, currentData, pagination, loading} = this.state;
    let { handleConfirm, handleCancel, handlePage } = this;
    let pageConfig = Object.assign({}, pagination, {
      onChange: handlePage
    })
    return (
      <div className='shadow-radius'>
          <div style={{ textAlign: "right" }}>
            <Search
              placeholder="请输入姓名或手机号"
              onSearch={value => console.log(value)}
              enterButton
              style={{ width: 200, marginBottom: '20px' }}
            />
          </div>
          
          <Table
              bordered
              columns={columns}
              dataSource={data}
              rowKey={row => row.id}
              pagination={pageConfig}
              loading={loading}
          />
          <EditForm visible={editable} data={currentData} onConfirm={handleConfirm} onCancel={handleCancel}/>
      </div>
    )
  }
}

export default TableEdit