import React,{Component} from 'react'
import { Table ,Button, message, Tag} from 'antd'
import { getBanner, putBanner } from '@/server'
import AddForm from './addForm';

class GuiderBanner extends Component {
  state = {
    data: [],
    addable: false,
    current: {},
    columns : [
      {
        title: '标题',
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
        title: '简介',
        dataIndex: 'subTitle',
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
              </div>
            )
        }
      }
    ]
  }
  componentDidMount() {
    this.getBanner();
  }
  getBanner() {
    this.setState(
        {
            loading: true
        }
    )
    getBanner().then(
      res => {
        let list = res.data;
        list.id = 1;
        this.setState(
          {
            data: [list],
            loading: false
          }
        )
      }
    )
  }
  handleEdit(row){
    this.setState(
        {
            current: row,
            addable: true
        }
    )
  }
  handleCreate = () => {
    this.setState(
      {
        current: {},
        addable: true
      }
    )
  }
  handleAddConfirm = (values) => {
    let params = Object.assign({}, values);
    putBanner(params).then(
      res => {
        message.success("banner设置成功");
        this.getBanner();
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
  handlePicClose =  () => {
    let result = Object.assign(this.state.current, {cover: ''});
    this.setState(
        {
            current: result
        }
      )
  }
  
  render() {
    let { addable, columns, data, loading, current} = this.state;
    let { handleCreate, handleAddConfirm, handleCancel, handlePicClose } = this;

    return (
      <div className='shadow-radius'>
          <Button type="primary" onClick={handleCreate} style={{marginBottom: '20px'}}>创建baner</Button>
          <Table
              bordered
              columns={columns}
              dataSource={data}
              rowKey={row => row.id}
              pagination={false}
              loading={loading}
              style={{marginBottom: '20px'}}
          />
          <AddForm visible={addable} initPhoto={current.cover} current = {current} onConfirm={handleAddConfirm} onCancel={handleCancel} handlePicClose={handlePicClose}/>
      </div>
    )
  }
}

export default GuiderBanner