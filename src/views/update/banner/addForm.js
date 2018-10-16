import React, { Component } from 'react';
import { Form, Input, Modal, Button, Icon, Upload, message } from 'antd';

const FormItem = Form.Item;

class App extends Component {
    state = {

    }
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
                if(!this.props.cover) {
                    message.error('请上传banner图！');
                    return;
                }
                values.cover = this.props.cover;
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

    getSubTitles = (list) => {
        return list.map((item, index) => {
            return  <FormItem
                        required={false}
                        key={index}
                    >
                        <Input placeholder="请输入宣传语" value={item} style={{ width: '92%', marginRight: 8 }} onChange={this.handleTitle.bind(this, index)}/>

                        {list.length > 0 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.removeTitle(index)}
                            />
                            ) : null
                        }
                    </FormItem>
        })
    }
    addTitle = () => {
        const { form } = this.props;
        const basic_titles = form.getFieldValue('subTitle');
        let tpl = '';
        let nextTitles = basic_titles.concat(tpl);
        
        form.setFieldsValue({
            subTitle: nextTitles,
        });       
    }
    handleTitle = (key, e) => {
        const { form } = this.props;
        let titles = form.getFieldValue('subTitle');
        titles[key] = e.target.value;
        form.setFieldsValue({
            subTitle: titles,
        });
    }
    removeTitle = (index) => {
        const { form } = this.props;
        const basic_titles = form.getFieldValue('subTitle');
        if (basic_titles.length === 0) {
            return;
        }
        let nextTitles = basic_titles.filter(
            (key, s_index) => {
                return s_index !== index;
            }
        );
        form.setFieldsValue({
            subTitle: nextTitles,
        });
    }
    getDefaultPhoto = (cover) => {
        return(
            <div className="upload_img_wrap" style={{width: '100%'}}>
                <img src={cover} className="photo"/>
                <i title="删除文件" className="close" onClick={this.handlePicClose}>
                    <svg viewBox="64 64 896 896" className="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                </i>
            </div>
        )
    }
    handlePicClose = () => {
        this.props.handlePicClose();
    }
    handleUpload = (info, type) => {
        if (info.file.status === 'done') {
            if(info.file.response.code == 1) {
                message.success(`${info.file.name} 上传成功`);
                this.props.handlePicUpload(info.file.response.data[0]);
            }  else {
                message.error(`${info.file.name} 上传失败.`);
            }            
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
    }
    beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片尺寸超过2M，建议压缩后上传!');
        }
        return isLt2M;
    }

    render() {
        let { visible, current, cover } = this.props;
        let { handleSubmit, handleCancel } = this;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('subTitle', { initialValue: current.subTitle || [] });
        let titles = getFieldValue('subTitle') || [];
        const props = {
            // action: 'http://moseycat.com:8081/admin/images',
            action: '//b.moseycat.com/admin/images',
            // action: 'http://localhost:8000/admin/images',
            onChange: this.handleUpload,
            beforeUpload: this.beforeUpload,
            multiple: false,
            withCredentials: true,
        };

        return (
            <Modal
            title="定制师banner"
            visible={visible}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
            >
                <Form>
                    <FormItem
                        label="标题"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                    {getFieldDecorator('title', {
                        initialValue: current.title || '',
                        rules: [{ required: true, message: '请输入标题' }],
                    })(
                        <Input />
                    )}
                    </FormItem>
                    <FormItem
                        label="banner图"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                        <Upload name="image[]" {...props}>
                            <Button>
                                <Icon type="upload" /> upload
                            </Button>
                        </Upload>
                        {cover && this.getDefaultPhoto(cover)}
                    </FormItem>
                    <FormItem
                        label="描述文字"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                    >
                        { titles.length > 0 && this.getSubTitles(titles) }
                        <Button type="dashed" onClick={this.addTitle} style={{ width: '100%' }}>
                            <Icon type="plus" /> Add field
                        </Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const AddForm = Form.create()(App);
export default AddForm;