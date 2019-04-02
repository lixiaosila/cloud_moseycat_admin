import React, { Component } from 'react'
import { Table, Button, Tag, Divider } from 'antd';
import { getUser } from '@/server/index';

class Detail extends Component {
    state = {
        data: [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        }],
        page: 1
    }
    componentDidMount() {
        this.getUser()
    }
    getUser = () => {
        let params = {
            page: this.state.page 
        }
        getUser(params).then(
            res => {
                console.log('res', res);
            }
        )
    }
    handle = () => {
        console.log(1)
    }
    render() {
        let { handle } = this;
        let { data } = this.state;
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: tags => (
                <span>
                    {tags.map(tag => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>;
                    })}
                </span>
                ),
          }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
                <a href="javascript:;">Invite {record.name}</a>
                <Divider type="vertical" />
                <a href="javascript:;">Delete</a>
              </span>
            ),
        }];
          
        return(
            <div style={{ background: '#FFF', padding: '30px' }}>
                <Button type="primary" style={{ marginBottom: '30px' }} onClick={ handle }>导出EXCEL</Button>
                <Table columns={columns} dataSource={data} />
            </div>
        )
    }
}

export default Detail;
