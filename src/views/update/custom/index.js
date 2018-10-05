import React, {Component} from 'react';
import { Form, Button, Upload, Icon, Rate, Input } from 'antd';
import E from 'wangeditor';
import { getGuider, addGuider, putGuider } from '@/server'

const FormItem = Form.Item;
  
class EditForm extends Component {
    state = {
        data: [],
        editor: '',
        content: ''
    }
    componentDidMount() {
        this.getEditConfig();
    }
    getEditConfig() {    
        const elem = this.refs.editorElem;
        this.editor = new E(elem);
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.customConfig.onchange = html => {
            console.log('html', html);
            this.setState({
                content: html
            })
        };
        this.editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'image',  // 插入图片
            'undo',  // 撤销
            'redo'  // 重复
        ];
        this.editor.customConfig.uploadImgServer = 'http://moseycat.com:8081/admin/images';
        this.editor.create();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { photo, content } = this.state;
                let params = {
                    "name": values.name,
                    "photo": photo[0],
                    "field": values.field,
                    "title": values.title,
                    "content": content
                }
                addGuider(params).then(
                    res => {
                        console.log('res', res);
                    }
                )
                console.log('Received values of form: ', values);
            }
        });
    }
    handleUpload = ({file, fileList}) => {
        if (file.status !== 'uploading') {
            console.log(file, fileList);
            this.setState(
                {
                    photo: file.response.data
                }
            )
        }
    }
    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    getTitles = (titles, getFieldDecorator) => {
        return titles.map((item, index) => {
            return  <FormItem
                        required={false}
                        key={index}
                    >
                        <Input placeholder="请输入宣传语" style={{ width: '60%', marginRight: 8 }} onChange={this.handleTitle.bind(this, index)}/>

                        {titles.length > 0 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.removeTitle(item)}
                            />
                            ) : null
                        }
                    </FormItem>
        })
    }
    getFields = (titles, getFieldDecorator) => {
        return titles.map((item, index) => {
            return  <FormItem
                        required={false}
                        key={index}
                    >
                        <div style={{ width: '60%', marginRight: 8, display: 'inline-block' }}>
                            <div className="fields_wrap">
                                <Input placeholder="标题" style={{ boxSizing: 'border-box',width: '50%', marginRight: 4 }} onChange={this.handleField.bind(this, index, 0)}/>
                                <Input placeholder="内容" style={{ width: '50%' }} onChange={this.handleField.bind(this, index, 1)}/>
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
    removeTitle = (item) => {
        const { form } = this.props;
        const basic_titles = form.getFieldValue('title');
        if (basic_titles.length === 0) {
            return;
        }
        let nextTitles = basic_titles.filter(key => key !== item);
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

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4},
            wrapperCol: { span: 14 },
        };
        getFieldDecorator('title', { initialValue: [] });
        getFieldDecorator('field', { initialValue: [] });
        let titles = getFieldValue('title') || [];
        let fields = getFieldValue('field') || [];
        
        const props = {
            action: 'http://moseycat.com:8081/admin/images',
            onChange: this.handleUpload,
            listType: "picture",
            multiple: false,
            withCredentials: true
        };
        
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="姓名"
                >
                {getFieldDecorator('name', {
                  rules: [{ required: false, message: '请输入姓名!' }],
                })(
                  
                    <Input placeholder="请输入姓名" style={{ width: '60%' }} />
                )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                        label="头像"
                    >
                    {getFieldDecorator('photo', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                        rules: [{ required: false, message: '请上传头像!' }],
                    })(
                        <Upload name="image[]" {...props}>
                            <Button>
                                <Icon type="upload" /> Click to upload
                            </Button>
                        </Upload>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                        label="宣传语"
                    >
                    <div>
                        { titles.length > 0 && this.getTitles(titles, getFieldDecorator) }
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
                        { fields.length > 0 && this.getFields(fields, getFieldDecorator) }
                        <Button type="dashed" onClick={this.addField} style={{ width: '60%' }}>
                            <Icon type="plus" /> Add field
                        </Button>
                    </div>
                </FormItem>
                <FormItem>
                    <div ref="editorElem" style={{textAlign: 'left',  margin: '20px'}}></div> 
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 12, offset: 6 }}
                >
                    <Button type="primary" htmlType="submit">Submit</Button>
                </FormItem>
        </Form>
        );
    }
}
  
const WrappedForm = Form.create()(EditForm);
export default WrappedForm;