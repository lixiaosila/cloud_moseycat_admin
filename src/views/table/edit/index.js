import React,{Component} from 'react'
import { Table ,Button, Input, message, Popconfirm} from 'antd'
import { getTravels, putTravels, deleteTravels } from '@/server'
import EditForm from './editForm';

const data= [
  {
    'name': '范杰',
    'email': 't.hee@zjok.bf',
    'address': '山西省 晋城市 阳城县',
    'date': '2006-08-30'
  },
  {
    'name': '段强',
    'email': 's.turg@oxbxcgofx.biz',
    'address': '江西省 景德镇市 昌江区',
    'date': '2015-05-15'
  },
  {
    'name': '姜超',
    'email': 't.uhlmwtv@hbbsngg.tr',
    'address': '内蒙古自治区 锡林郭勒盟 正镶白旗',
    'date': '1986-12-21'
  },
  {
    'name': '曾杰',
    'email': 'r.biitopmqg@qubxsk.中国',
    'address': '广西壮族自治区 贵港市 平南县',
    'date': '1991-12-10'
  },
  {
    'name': '陆芳',
    'email': 's.mjzxwuzb@sxbguagfpd.li',
    'address': '广东省 江门市 蓬江区',
    'date': '2002-12-08'
  },
  {
    'name': '龙明',
    'email': 'x.lpvc@fkyejfw.mt',
    'address': '江苏省 南通市 港闸区',
    'date': '1980-02-29'
  },
  {
    'name': '傅勇',
    'email': 'c.kymaby@hhtahqoguz.aw',
    'address': '天津 天津市 河东区',
    'date': '1984-09-05'
  },
  {
    'name': '杜艳',
    'email': 't.sdolw@abhbuict.ph',
    'address': '江西省 赣州市 上犹县',
    'date': '2005-01-20'
  },
  {
    'name': '姚艳',
    'email': 'b.wzndiez@bgzi.cn',
    'address': '江西省 赣州市 信丰县',
    'date': '2013-03-10'
  },
  {
    'name': '杜丽',
    'email': 'x.obqgkmwp@tsyq.中国',
    'address': '香港特别行政区 九龙 深水埗区',
    'date': '1970-03-04'
  }
]
class TableEdit extends Component {
  state = {
    data,
    editable: false,
    currentPage: 1,
    totalPage: 1,
    currentData: {},
    columns : [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '22%'
      }, {
        title: 'Date',
        dataIndex: 'date',
        width: '22%',
      }, {
        title: 'Email',
        dataIndex: 'email'
      },{
        title:'handle',
        dataIndex: 'control',
        width: '18%',
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
                    onConfirm={() => this.deleteRow(index)}
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
  getList() {
    getTravels().then(res => {
      console.log('res', res)
    })
  }
  // 点击修改时，将当前行改成可编辑状态,并将当前Input的值修改为当前行name的值
  setEditable(row){
    console.log('row', row);
    this.setState(
      {
        editable: true,
        currentData: row
      }
    )
    console.log('12')
  }

  deleteRow(index) {
    let params = {
      id: id
    }
    deleteTravels().then(res => {
      console.log('res', res);
    })
  }
  
  handleConfirm = () =>{
    console.log('1212')
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
    let { editable, columns, data, currentData} = this.state;
    let { handleConfirm, handleCancel } = this;
    return (
      <div className='shadow-radius'>
          <Table
              bordered
              columns={columns}
              dataSource={data}
              pagination={false}
              rowKey={row => row.date}
          />
          <EditForm visible={editable} data={currentData} onConfirm={handleConfirm} onCancel={handleCancel}/>
      </div>
    )
  }
}

export default TableEdit