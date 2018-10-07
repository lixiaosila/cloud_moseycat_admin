import React, {Component} from 'react';
import { Form, Button, Upload, Icon, message, Input } from 'antd';
import E from 'wangeditor';
import { getGuider, addGuider, putGuider } from '@/server'

const FormItem = Form.Item;
  
class EditForm extends Component {
    state = {
        data: [],
        photo: [],
        initPhoto: [],
        editor: '',
        content: '',
        fileList: [],
        isLogin: true
    }
    componentDidMount() {
        if(this.props.match.params.id != ':id') {
            this.getInfo(this.props.match.params.id);
        }
        this.getEditConfig();
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
                        initPhoto: [res.data.photo],
                        content: res.data.content
                    }
                )
                this.editor.txt.html(res.data.content)
            }
        )
    }
    getEditConfig() {    
        const elem = this.refs.editorElem;
        this.editor = new E(elem);
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.customConfig.onchange = html => {
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
        // 隐藏“网络图片”tab
        this.editor.customConfig.showLinkImg = false;
        this.editor.customConfig.withCredentials = true;
        this.editor.customConfig.uploadImgServer = '//b.moseycat.com/admin/images';
        this.editor.customConfig.uploadFileName = 'image[]';
        this.editor.customConfig.uploadImgHooks = {
            success: function success(xhr, editor, result) {

            },
            fail: function fail(xhr, editor, result) {
                if(result.code == -3) {
                    message.error('请先登录')
                }
            },
            error: function error(xhr, editor) {
                // 图片上传出错时触发
            },
        }
        this.editor.create();
    }
    getDefaultPhoto = () => {
        let { initPhoto, data } = this.state;
        if(initPhoto.length > 0) {
            return(
                <div className="upload_img_wrap">
                    <img src={data.photo} className="photo"/>
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
            initPhoto: []
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(!this.state.isLogin) {
                    message.error('请先登录');
                    return;
                }
                let { initPhoto, photo, content } = this.state;
                if(initPhoto.length == 0 && photo.length == 0) {
                    message.error('请上传头像！');
                    return;
                }
                let { history } = this.props;
                let params = {
                    "name": values.name,
                    "field": values.field,
                    "title": values.title,
                    'area': values.area,
                    "content": content
                }
                if(initPhoto.length > 0) {
                    params.photo = initPhoto[0];
                } 
                if(photo.length > 0) {
                    params.photo = photo[0];
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
    handleUpload = ({file, fileList}) => {
        let { initPhoto } = this.state;
        if(initPhoto.length > 0) {
            return false;
        }
        if(fileList.length > 1) {
            message.error('头像只能有一张');
            return;
        }
        if (file.status !== 'uploading') {
            if(file.response.code == -3) {
                message.error(file.response.msg);
                this.setState(
                    {
                        isLogin: false
                    }
                )
            }
            this.setState(
                {
                    photo: file.response.data
                }
            )
        }
        this.setState({ fileList: fileList });
    }
    beforeUpload = (file) => {
        let { initPhoto, photo } = this.state;
        if(initPhoto.length > 0 || photo.length > 0) {
            message.error('头像只能有一张');
            return false
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

    render() {
        let { data, fileList } = this.state;
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
            action: '//b.moseycat.com/admin/images',
            onChange: this.handleUpload,
            listType: "picture",
            multiple: false,
            withCredentials: true,
            beforeUpload: this.beforeUpload,
            fileList: fileList
        };
        
        return (
            <Form onSubmit={this.handleSubmit}>
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
                    {
                        this.getDefaultPhoto(data)
                    }
                    <div style={{ width: '60%' }}>
                        <Upload name="image[]" {...props} >
                            <Button>
                                <Icon type="upload" /> Click to upload
                            </Button>
                        </Upload>
                    </div>
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
                    <div ref="editorElem" style={{textAlign: 'left',  margin: '20px'}}></div> 
                </FormItem>
                <FormItem
                    wrapperCol={{ span: 12, offset: 6 }}
                >
                    <Button type="primary" htmlType="submit">确定</Button>
                </FormItem>
        </Form>
        );
    }
}
  
const WrappedForm = Form.create()(EditForm);
export default WrappedForm;