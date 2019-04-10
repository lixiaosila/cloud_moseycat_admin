import React, { Component } from 'react'
import { Table, Row, Col, Input } from 'antd';
import { getCode } from '@/server/index';

const Search = Input.Search;

class Lottery extends Component {
    state = {
        data: [],
        loading: false,
        columns: [{
            title: '姓名',
            dataIndex: 'userName',
            key: 'userName',
            render: text => <a href="javascript:;">{text}</a>,
        }, 
        {
            title: '手机号',
            dataIndex: 'userMobile',
            key: 'userMobile',
        },
        {
            title: '参与活动时间',
            dataIndex: 'createdTime',
            key: 'createdTime',
        }]
    }
    getCode = (params) => {
        getCode(params).then(
            res => {
                this.setState(
                    {
                        data: res.data.list 
                    }
                )
            }
        )
    }
    handleSelect = (value) => {
        let params = {
            code: value
        }
        this.getCode(params);
    }

    render() {
        let { columns, data, loading } = this.state;
        let { handleSelect } = this;          
        return(
            <div style={{ background: '#FFF', padding: '30px' }}>
                
                <Row>
                    <Col span={12}>
                        <Search
                            placeholder="请输入需要查询的号码"
                            onSearch={handleSelect}
                            enterButton
                            style={{marginBottom: '30px'}}
                        />
                    </Col>
                </Row>
                <Table
                    bordered
                    columns={columns}
                    dataSource={data}
                    rowKey={row => row.id}
                    loading={loading}
                />
            </div>
        )
    }
}

export default Lottery;
