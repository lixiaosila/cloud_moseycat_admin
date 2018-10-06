import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

class App extends Component {

    isEmpty(data) {
        if (JSON.stringify(data) === '{}') {
            return true // 如果为空,返回false
        }
        return false
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onConfirm(values);
                this.props.form.resetFields();
                this.props.onCancel();
            }
        });
    }
    handleCancel = (e) => {
        e.preventDefault();
        this.props.form.resetFields();
        this.props.onCancel();
    }

    render() {
        let { visible } = this.props;
        let { handleSubmit, handleCancel } = this;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
            title="新增管理员"
            visible={visible}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
            >
                <Form>
                    <FormItem
                        label="用户名"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请填写用户名' }],
                    })(
                        <Input />
                    )}
                    </FormItem>
                    <FormItem
                        label="密码"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请填写密码'}],
                    })(
                        <Input />
                    )}
                    </FormItem>
                    <FormItem
                        label="手机号"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                    {getFieldDecorator('mobile', {
                        rules: [{ required: true, message: '请填写正确的手机号', pattern:/^((1[3-8][0-9])+\d{8})$/ }],
                    })(
                        <Input />
                    )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const EditForm = Form.create()(App);
export default EditForm;