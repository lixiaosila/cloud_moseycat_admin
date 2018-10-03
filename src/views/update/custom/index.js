import React, {Component} from 'react';
import { Form, Button, Upload, Icon, Rate, Input } from 'antd';
import E from 'wangeditor';
  
const FormItem = Form.Item;
  
class EditForm extends Component {
    state = {
        data: [],
        editor: '',
        editorContent: ''
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
                editorContent: html
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
        this.editor.customConfig.uploadImgServer = '/upload';
        this.editor.create();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', this.state.editorContent);
            }
        });
    }
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
        return e;
        }
        return e && e.fileList;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4},
            wrapperCol: { span: 14 },
        };
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="姓名"
                >
                <Input placeholder="请输入姓名" style={{ width: '60%' }} />
            </FormItem>
            <FormItem
                {...formItemLayout}
                    label="头像"
                >
                {getFieldDecorator('upload', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                })(
                    <Upload name="logo" action="/upload.do" listType="picture" >
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
                <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                    <Icon type="plus" /> Add field
                </Button>
            </FormItem>
            <FormItem
                {...formItemLayout}
                    label="专业领域"
                >
                <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                    <Icon type="plus" /> Add field
                </Button>
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