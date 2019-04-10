import React, { Component } from 'react';
import { Form, Button, Upload, Icon, message, Input, DatePicker } from 'antd';
import { getConfig, putConfig } from '@/server/index';
import moment from 'moment';

const FormItem = Form.Item;
  
class Config extends Component {
    state = {
        data: [],
        previewPhoto: ''
    }
    componentDidMount() {
        this.getConfig();
    }
    getConfig() {
        getConfig().then(
            res => {
                this.setState({
                    data: res.data,
                    previewPhoto: res.data.cover || ''
                })
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
                    message.error('请上传封面图片！');
                    return;
                }
                let params = {
                    "cover": previewPhoto,
                    "endStartTime": values.endStartTime.format("YYYY-MM-DD HH:mm"),
                    "awardTime": values.awardTime.format("YYYY-MM-DD HH:mm"),
                    "rule": values.rule,
                    "share": values.share
                }
                putConfig(params).then(
                    res => {
                        if(res.code == 1) {
                            message.success('配置成功'); 
                            this.getConfig();
                        }

                        console.log('res', res);
                    }
                )
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
                        previewPhoto: info.file.response.data.url
                    }
                )
            } else {
                message.error(`${info.file.name} 上传失败.`);
            }
            
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
    }
    getTitles = (rules) => {
        return rules.map((item, index) => {
            return  <FormItem
                        required={false}
                        key={index}
                    >
                        <Input placeholder="请输入规则" value={item} style={{ width: '80%', marginRight: 8 }} onChange={this.handleRule.bind(this, index)}/>

                        {rules.length > 0 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.removeRule(index)}
                            />
                            ) : null
                        }
                    </FormItem>
        })
    }

    addRule = () => {
        const { form } = this.props;
        const basic_rules = form.getFieldValue('rule');
        let tpl = '';
        let nextTitles = basic_rules.concat(tpl);
        console.log('basic_rules', basic_rules, nextTitles)
        form.setFieldsValue({
            rule: nextTitles,
        });       
    }
    handleRule = (key, e) => {
        const { form } = this.props;
        let rules = form.getFieldValue('rule');
        rules[key] = e.target.value;
        form.setFieldsValue({
            rule: rules,
        });
    }
    removeRule = (index) => {
        const { form } = this.props;
        const basic_rules = form.getFieldValue('rule');
        if (basic_rules.length === 0) {
            return;
        }
        let nextRules = basic_rules.filter(
            (key, s_index) => {
                return s_index !== index;
            }
        );
        form.setFieldsValue({
            rule: nextRules,
        });
    }
    handleEndStartChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }
    handleEndStartOk = (value) => {
        console.log('onOk: ', value);
    }
    handleAwardTimeChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }
    handleAwardTimeOk = (value) => {
        console.log('onOk: ', value);
    }
    render() {
        let { data, previewPhoto } = this.state;
        let { handleEndStartChange, handleEndStartOk, handleAwardTimeChange, handleAwardTimeOk} = this;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4},
            wrapperCol: { span: 14 },
        };
        getFieldDecorator('rule', { initialValue: data.rule || [] });
        let rules = getFieldValue('rule') || [];
        const props = {
            // action: 'http://moseycat.com:8081/admin/images',
            action: '//wanqianprod.hizeng.cn/admin/images',
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
                    {getFieldDecorator('endStartTime', {
                        initialValue: moment(data.endStartTime) || moment(),
                        rules: [{ required: true, message: '请输入活动持续时间' }],
                    })(
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            placeholder="请输入活动持续时间"
                            onChange={handleEndStartChange}
                            onOk={handleEndStartOk}
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="活动抽奖时间"
                >
                    {getFieldDecorator('awardTime', {
                        initialValue: moment(data.awardTime) || moment(),
                        rules: [{ required: true, message: '请输入活动抽奖时间' }],
                    })(
                    
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            placeholder="请输入活动持续时间"
                            onChange={handleAwardTimeChange}
                            onOk={handleAwardTimeOk}
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="分享文案"
                >
                    {getFieldDecorator('share', {
                        initialValue: data.share || '',
                        rules: [{ required: true, message: '请输入分享文案' }],
                    })(
                    
                        <Input placeholder="请输入分享文案" style={{ width: '80%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                        label="封面图片"
                    >
                    <div style={{ width: '80%' }}>
                        <Upload name="image" {...props} >
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
                        { rules.length > 0 && this.getTitles(rules) }
                        <Button type="dashed" onClick={this.addRule} style={{ width: '80%' }}>
                            <Icon type="plus" /> 新增活动规则
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