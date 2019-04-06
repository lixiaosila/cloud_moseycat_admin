import React, { Component } from 'react'
import { Table, Button, Tag, Divider } from 'antd';
import { getUser } from '@/server/index';

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
    render() {
        let { columns, data, loading, pagination} = this.state;
        let { handlePage, handleAdd } = this;
        let pageConfig = Object.assign({},pagination, {
            onChange: handlePage
        })
          
        return(
            <div style={{ background: '#FFF', padding: '30px' }}>
                <Button type="primary" icon="download" style={{ marginBottom: '30px' }} href="//wanqianprod.hizeng.cn/admin/wechat/users?excel=1">
                    导出EXCEL
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

export default Detail;
