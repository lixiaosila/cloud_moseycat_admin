import React, {Component} from 'react';
import { Form, Button, Upload, Icon, message, Input } from 'antd';
import { getGuider, addGuider, putGuider } from '@/server'

// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import 'braft-editor/dist/index.css'

const FormItem = Form.Item;
  
class EditForm extends Component {
    state = {
        data: [],
        excludeControls:  ['letter-spacing','line-height','code','emoji','superscript','subscript','media'],
        content: '',
        previewPhoto: '',
        isLogin: true
    }
    componentDidMount() {
        if(this.props.match.params.id != ':id') {
            this.getInfo(this.props.match.params.id);
        }
    }
    getInfo(id) {
        let params = {
            id
        };
        getGuider(params).then(
            res => {
                this.setState(
                    {
                        data: res.data,
                        previewPhoto: res.data.photo,
                        content: BraftEditor.createEditorState(res.data.content)
                    }
                )
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
                let { previewPhoto, content } = this.state;
                if(!previewPhoto) {
                    message.error('请上传头像！');
                    return;
                }
                let { history } = this.props;
                let params = {
                    "name": values.name,
                    "field": values.field,
                    "title": values.title,
                    "area": values.area,
                    "content": content.toHTML(),
                    "photo": previewPhoto
                }
                if(this.props.match.params.id != ':id') {
                    params.id = this.props.match.params.id;
                    putGuider(params).then(
                        res => {
                            message.success("更新成功");
                            setTimeout(() => {
                                history.push('/update/guider')
                            }, 2000);
                        }
                    )
                } else {
                    addGuider(params).then(
                        res => {
                            message.success("创建成功");
                            setTimeout(() => {
                                history.push('/update/guider')
                            }, 2000);
                        }
                    )
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
                        <Input placeholder="请输入宣传语" value={item} style={{ width: '60%', marginRight: 8 }} onChange={this.handleTitle.bind(this, index)}/>

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
    getFields = (titles) => {
        return titles.map((item, index) => {
            return  <FormItem
                        required={false}
                        key={index}
                    >
                        <div style={{ width: '60%', marginRight: 8, display: 'inline-block' }}>
                            <div className="fields_wrap">
                                <Input placeholder="标题" value={item.title} style={{ boxSizing: 'border-box',width: '50%', marginRight: 4 }} onChange={this.handleField.bind(this, index, 0)}/>
                                <Input placeholder="内容" value={item.content} style={{ width: '50%' }} onChange={this.handleField.bind(this, index, 1)}/>
                            </div>
                        </div>
                        {titles.length > 0 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.removeField(item)}
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
    addField = () => {
        const { form } = this.props;
        const basic_fields = form.getFieldValue('field');
        let tpl = {
            title: '',
            content: ''
        };
        let nextFields = basic_fields.concat(tpl);
        form.setFieldsValue({
            field: nextFields,
        });
    }
    handleField = (key, type, e) => {
        const { form } = this.props;
        let fields = form.getFieldValue('field');
        if(type == 0) {
            fields[key]['title'] = e.target.value;
        } else {
            fields[key]['content'] = e.target.value;
        }
        form.setFieldsValue({
            field: fields,
        });
        
    }
    removeField = (item) => {
        const { form } = this.props;
        const basic_titles = form.getFieldValue('field');
        if (basic_titles.length === 0) {
            return;
        }
        let nextFields = basic_titles.filter(key => key !== item);
        form.setFieldsValue({
            field: nextFields,
        });
    }
    handleChange = (content) => {
        this.setState({ 
            content
        })
    }
    uploadHandler = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
            this.setState(
                {
                    content: ContentUtils.insertMedias(this.state.content, [{
                        type: 'IMAGE',
                        url: info.file.response.data[0]
                    }])
                }
            )
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
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

        const props_extend = {
            // action: 'http://moseycat.com:8081/admin/images',
            action: '//b.moseycat.com/admin/images',
            onChange: this.uploadHandler,
            beforeUpload: this.beforeUpload,
            showUploadList: false,
            multiple: false,
            withCredentials: true,
        };

        const extendControls = [
            {
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload
                        name="image[]" {...props_extend}
                    >
                        <button className="control-item button upload-button" data-title="插入图片">
                            <Icon type="picture" theme="filled" />
                        </button>
                    </Upload>
                )
            }
        ]

        const editorProps = {
            height: 500,
            value: this.state.content,
            onChange: this.handleChange,
            excludeControls: this.state.excludeControls,
            extendControls: extendControls
        }
        
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="定制师"
                >
                    {getFieldDecorator('name', {
                        initialValue: data.name || '',
                        rules: [{ required: true, message: '请输入定制师昵称' }],
                    })(
                    
                        <Input placeholder="请输入定制师昵称" style={{ width: '60%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="负责区域"
                >
                    {getFieldDecorator('area', {
                        initialValue: data.area || '',
                        rules: [{ required: true, message: '请输入定制师负责区域' }],
                    })(
                    
                        <Input placeholder="请输入定制负责区域" style={{ width: '60%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                        label="头像"
                    >
                    <div style={{ width: '60%' }}>
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
                        label="宣传语"
                    >
                    <div>
                        { titles.length > 0 && this.getTitles(titles) }
                        <Button type="dashed" onClick={this.addTitle} style={{ width: '60%' }}>
                            <Icon type="plus" /> Add field
                        </Button>
                    </div>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                        label="专业领域"
                    >
                    <div>
                        { fields.length > 0 && this.getFields(fields) }
                        <Button type="dashed" onClick={this.addField} style={{ width: '60%' }}>
                            <Icon type="plus" /> Add field
                        </Button>
                    </div>
                </FormItem>
                <FormItem>
                    <div style={{ border: '1px solid #c0c2c4', margin: '0 20px'}}>
                        <BraftEditor {...editorProps} />
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
  
const WrappedForm = Form.create()(EditForm);
export default WrappedForm;