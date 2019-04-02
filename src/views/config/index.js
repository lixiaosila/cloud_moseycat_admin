import React, { Component } from 'react';
import { Form, Button, Upload, Icon, message, Input } from 'antd';
import { getConfig } from '@/server/index';

const FormItem = Form.Item;
  
class Config extends Component {
    state = {
        data: [],
        previewPhoto: '',
        awardTime: "",
        endStartTime: "",
        keyword: "",
        rule: ""
    }
    componentDidMount() {
        this.getConfig();
    }
    getConfig() {
        let params = {
            debug: 1
        };
        getConfig(params).then(
            res => {
                console.log('res', res);
            }
        )
    }
    getDefaultPhoto = () => {
        let { previewPhoto } = this.state;
        if(previewPhoto) {
            return(
                <div className="upload_img_wrap">
                    <img src={previewPhoto} className="photo"/>
                    <i title="删除文件" className="close" onClick={this.handlePicClose}>
                        <svg viewBox="64 64 896 896" className="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                    </i>
                </div>
            )
        }
        return '';
    }
    handlePicClose = () => {
        this.setState({
            previewPhoto: ''
        })
    }
    handleFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { previewPhoto } = this.state;
                if(!previewPhoto) {
                    message.error('请上传头像！');
                    return;
                }
                let { history } = this.props;
                let params = {
                    "cover": "http://baidu.com",
                    "endStartTime": "2019-04-01 00:00:00",
                    "awardTime": "2019-04-02 00:00:00",
                    "rule": "活动规则",
                    "photo": previewPhoto
                }
                if(this.props.match.params.id != ':id') {
                    params.id = this.props.match.params.id;
                    
                } else {
                    
                }
            }
        });
    }
    beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片尺寸超过2M，建议压缩后上传!');
        }
        return isLt2M;
    }
    handleUpload = (info, type) => {
        if (info.file.status === 'done') {
            if(info.file.response.code == 1) {
                message.success(`${info.file.name} 上传成功`);
                this.setState(
                    {
                        previewPhoto: info.file.response.data[0]
                    }
                )
            } else {
                message.error(`${info.file.name} 上传失败.`);
            }
            
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
    }
    getTitles = (titles) => {
        return titles.map((item, index) => {
            return  <FormItem
                        required={false}
                        key={index}
                    >
                        <Input placeholder="请输入宣传语" value={item} style={{ width: '80%', marginRight: 8 }} onChange={this.handleTitle.bind(this, index)}/>

                        {titles.length > 0 ? (
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
        const basic_titles = form.getFieldValue('title');
        let tpl = '';
        let nextTitles = basic_titles.concat(tpl);
        
        form.setFieldsValue({
            title: nextTitles,
        });       
    }
    handleTitle = (key, e) => {
        const { form } = this.props;
        let titles = form.getFieldValue('title');
        titles[key] = e.target.value;
        form.setFieldsValue({
            title: titles,
        });
    }
    removeTitle = (index) => {
        const { form } = this.props;
        const basic_titles = form.getFieldValue('title');
        if (basic_titles.length === 0) {
            return;
        }
        let nextTitles = basic_titles.filter(
            (key, s_index) => {
                return s_index !== index;
            }
        );
        form.setFieldsValue({
            title: nextTitles,
        });
    }

    render() {
        let { data, previewPhoto } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4},
            wrapperCol: { span: 14 },
        };
        getFieldDecorator('title', { initialValue: data.title || [] });
        getFieldDecorator('field', { initialValue: data.field || [] });
        let titles = getFieldValue('title') || [];
        let fields = getFieldValue('field') || [];
        
        const props = {
            // action: 'http://moseycat.com:8081/admin/images',
            action: '//b.moseycat.com/admin/images',
            onChange: this.handleUpload,
            beforeUpload: this.beforeUpload,
            multiple: false,
            withCredentials: true,
        };

        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="活动持续时间"
                >
                    {getFieldDecorator('name', {
                        initialValue: data.name || '',
                        rules: [{ required: true, message: '请输入定制师昵称' }],
                    })(
                    
                        <Input placeholder="请输入定制师昵称" style={{ width: '80%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="中奖公布时间"
                >
                    {getFieldDecorator('area', {
                        initialValue: data.area || '',
                        rules: [{ required: true, message: '请输入定制师负责区域' }],
                    })(
                    
                        <Input placeholder="请输入定制负责区域" style={{ width: '80%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                        label="首页banner"
                    >
                    <div style={{ width: '80%' }}>
                        <Upload name="image[]" {...props} >
                            <Button>
                                <Icon type="upload" /> Click to upload
                            </Button>
                        </Upload>
                    </div>
                    {
                        previewPhoto && this.getDefaultPhoto()
                    }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                        label="活动规则"
                    >
                    <div>
                        { titles.length > 0 && this.getTitles(titles) }
                        <Button type="dashed" onClick={this.addTitle} style={{ width: '80%' }}>
                            <Icon type="plus" /> Add field
                        </Button>
                    </div>
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 12, offset: 6 }}
                >
                    <Button type="primary" onClick={this.handleFormSubmit}>确定</Button>
                </FormItem>
        </Form>
        );
    }
}
  
const WrappedForm = Form.create()(Config);
export default WrappedForm;