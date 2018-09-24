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
        let { visible, data } = this.props;
        let { handleSubmit, handleCancel } = this;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
            title="Basic Modal"
            visible={visible}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
            >
                <Form>
                    <FormItem
                        label="姓名"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                    {getFieldDecorator('name', {
                        initialValue: data.name,
                        rules: [{ required: true, message: '请输入姓名' }],
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
                        initialValue: data.mobile,
                        rules: [{ required: true, message: '请填写正确的手机号', pattern:/^((1[3-8][0-9])+\d{8})$/ }],
                    })(
                        <Input />
                    )}
                    </FormItem>
                    <FormItem
                        label="目的地"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                    {getFieldDecorator('place', {
                        initialValue: data.place,
                        rules: [],
                    })(
                        <Input />
                    )}
                    </FormItem>
                    <FormItem
                        label="旅游需求"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                    {getFieldDecorator('remark', {
                        initialValue: data.remark,
                        rules: [],
                    })(
                        <Input.TextArea type="textarea" placeholder="定制需求" autosize = {{ minRows: 2, maxRows: 6 }} />
                    )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const EditForm = Form.create()(App);
export default EditForm;