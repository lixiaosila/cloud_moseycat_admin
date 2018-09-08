import React,{Component} from 'react'
import { Table ,Button, Input, message, Popconfirm } from 'antd'
import { getTravels, putTravels, deleteTravels } from '@/server'
import EditForm from './editForm';


class TableEdit extends Component {
  state = {
    data: [],
    editable: false,
    currentPage: 1,
    totalPage: 1,
    totalCount: 1,
    currentData: {},
    pagination: {
      total: 1,
      current: 1
    },
    columns : [
      {
        title: '姓名',
        dataIndex: 'name',
        width: '22%'
      }, {
        title: '手机号',
        dataIndex: 'mobile',
        width: '22%',
      }, {
        title: '目的地',
        dataIndex: 'place'
      },{
        title: '定制需求',
        dataIndex: 'remark'
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
        title:'留言',
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
                >修改</Button>
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
                <Button
                    ghost
                    onClick={this.cancel.bind(this, row, text)}
                    style={{marginRight:12}}
                    type='primary'
                >取消</Button>
              </div>
            )
        }
      }
    ]
  }
  componentDidMount() {
    this.getList();
  }
  getList() {
    getTravels().then(res => {
      this.setState(
        {
          data: res.data.list,
          totalPage: res.data.pageCount,
          totalCount: res.data.total,
          pagination: {
            total: res.data.total,
            current: this.currentPage,
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
  cancel() {

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

  render() {
    let { editable, columns, data, currentData, pagination} = this.state;
    let { handleConfirm, handleCancel } = this;
    return (
      <div className='shadow-radius'>
          <Table
              bordered
              columns={columns}
              dataSource={data}
              pagination={false}
              rowKey={row => row.id}
              pagination={pagination}
          />
          <EditForm visible={editable} data={currentData} onConfirm={handleConfirm} onCancel={handleCancel}/>
      </div>
    )
  }
}

export default TableEdit