import React, { Component } from 'react';
import { Form, Select, Input, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class App extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleSelectChange = (value) => {
    console.log(value);
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  }

  render() {
    let { editable } = this.props;
    console.log('editable', editable)
    const { getFieldDecorator } = this.props.form;
    return (
        <div className="common_edit">
            <div className="common_mask">

            </div>
            <div className="common_form">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        label="姓名"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                    {getFieldDecorator('note', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(
                        <Input />
                    )}
                    </FormItem>
                    <FormItem
                        label="手机号"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                    {getFieldDecorator('note', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(
                        <Input />
                    )}
                    </FormItem>
                    <FormItem
                        label="目的地"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                    {getFieldDecorator('note', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(
                        <Input />
                    )}
                    </FormItem>
                    <FormItem
                        label="旅游需求"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                    {getFieldDecorator('note', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(
                        <Input.TextArea type="textarea" placeholder="自适应内容高度" autosize = {{ minRows: 2, maxRows: 6 }} />
                    )}
                    </FormItem>
                    <FormItem
                        className="common_btn_wrap"
                        wrapperCol={{ span: 24}}
                    >
                        <Button type="primary" className="common_btn_success" htmlType="submit" span={12}>
                            修改
                        </Button>
                        <Button type="primary" htmlType="submit" span={12}>
                            取消
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    );
  }
}

const EditForm = Form.create()(App);
export default EditForm;