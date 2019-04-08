import React, { Component } from 'react'
import { Table, Button, Popconfirm, Row, Col } from 'antd';
import { getUser, restart } from '@/server/index';

class Detail extends Component {
    state = {
        data: [],
        currentPage: 1,
        loading: false,
        pagination: {
          total: 1,
          current: 1,
          pageSize: 20
        },
        columns: [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="javascript:;">{text}</a>,
        }, 
        {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: '参与活动时间',
            dataIndex: 'createdTime',
            key: 'createdTime',
        }]
    }
    componentDidMount() {
        this.getUser()
    }
    getUser = (page = 1) => {
        let params = {
            page: page
        }
        this.setState({
            loading: true
        })
        getUser(params).then(
            res => {
                this.setState({
                    data: res.data.list,
                    loading: false,
                    pagination: {
                        total: res.data.total,
                        current: this.state.currentPage,
                        pageSize: 20
                    }
                })
            }
        )
    }
    handlePage = (currentPage) => {
        this.setState(
          {
            currentPage: currentPage
          }
        )
        this.getUser(currentPage)
    }
    confirm = () => {
        restart().then(
            res => {
                this.setState({
                    currentPage: 1
                })
                this.getUser()
                console.log('res', res);
            }
        )
    }
    render() {
        let { columns, data, loading, pagination} = this.state;
        let { handlePage, confirm } = this;
        let pageConfig = Object.assign({},pagination, {
            onChange: handlePage
        })
          
        return(
            <div style={{ background: '#FFF', padding: '30px' }}>
                <Row>
                    <Col span={12}>
                        <Button type="primary" icon="download" style={{ marginBottom: '30px' }} href="//wanqiantest.hizeng.cn/admin/wechat/users?excel=1">
                            导出EXCEL
                        </Button>
                    </Col>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <Popconfirm placement="top" title="确认清除数据吗？" onConfirm={confirm} okText="确认" cancelText="取消">
                            <Button type="primary" style={{ marginBottom: '30px' }} href="//wanqiantest.hizeng.cn/admin/wechat/users?excel=1">
                                清除数据
                            </Button>
                        </Popconfirm>
                    </Col>
                </Row>
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

export default Detail;
