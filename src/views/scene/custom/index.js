import React, {Component} from 'react';
import { Form, Button, Upload, Icon, message, Input, Radio } from 'antd';
import E from 'wangeditor';
import { getScene, addScene, putScene } from '@/server'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
  
class EditForm extends Component {
    state = {
        data: [],
        cover: [],
        initPhoto: [],
        editor: '',
        featureContent: '',
        travelContent: '',
        feeContent: '',
        fileList: [],
        currentIndex: 1,
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
        getScene(params).then(
            res => {
                this.setState(
                    {
                        data: res.data,
                        initPhoto: [res.data.cover],
                        featureContent: res.data.featureContent,
                        travelContent: res.data.travelContent,
                        feeContent: res.data.feeContent,
                    }
                )
                this.swicthContent(1);
            }
        )
    }
    getEditConfig() {    
        const elem = this.refs.editorElem;
        this.editor = new E(elem);
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.customConfig.onchange = html => {
            if(this.state.currentIndex == 1) {
                this.setState({
                    featureContent: html
                })
                return;
            }
            if(this.state.currentIndex == 2) {
                this.setState({
                    travelContent: html
                })
                return;
            }
            if(this.state.currentIndex == 3) {
                this.setState({
                    feeContent: html
                })
                return;
            }
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
                    <img src={data.cover} className="photo"/>
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
    onRemove = () => {
        this.setState({
            cover: [],
            fileList: []
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
                let { cover, initPhoto, featureContent, travelContent, feeContent } = this.state;
                if(cover.length == 0 &&  initPhoto.length == 0 ) {
                    message.error('请上传banner！');
                    return;
                }
                let { history } = this.props;
                let params = {
                    "title": values.title,
                    "subTitle": values.subTitle,
                    "price": values.price,
                    "featureContent": featureContent,
                    "travelContent": travelContent,
                    "feeContent": feeContent
                }
                if(initPhoto.length > 0) {
                    params.cover = initPhoto[0];
                } 
                if(cover.length > 0) {
                    params.cover = cover[0];
                }
                if(this.props.match.params.id != ':id') {
                    params.id = this.props.match.params.id;
                    putScene(params).then(
                        res => {
                            message.success("更新成功");
                            setTimeout(() => {
                                history.push('/scene/list')
                            }, 1000);
                        }
                    )
                } else {
                    addScene(params).then(
                        res => {
                            message.success("创建成功");
                            setTimeout(() => {
                                history.push('/scene/list')
                            }, 1000);
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
            message.error('banner只能有一张');
            return;
        }
        if (file.status !== 'uploading') {
            if(file.response && file.response.code == -3) {
                message.error(file.response.msg);
                this.setState(
                    {
                        isLogin: false
                    }
                )
            }   
            this.setState(
                {
                    cover: file.response.data
                }
            )
        }
        this.setState({ fileList: fileList });
    }
    beforeUpload = (file) => {
        let { initPhoto, cover } = this.state;
        if(initPhoto.length > 0 || cover.length > 0) {
            message.error('banner只能有一张');
            return false
        }
    }
    handleSwitch = (item) => {
        this.setState(
            {
                currentIndex: item.target.value
            }
        )
        this.swicthContent(item.target.value);
    }
    swicthContent = (value) => {
        if(value == 1) {
            this.editor.txt.html(this.state.featureContent);
        }
        if(value == 2) {
            this.editor.txt.html(this.state.travelContent);
        }
        if(value == 3) {
            this.editor.txt.html(this.state.feeContent);
        }
    }

    render() {
        let { data, fileList } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4},
            wrapperCol: { span: 14 },
        };
        
        const props = {
            action: '//b.moseycat.com/admin/images',
            onChange: this.handleUpload,
            listType: "picture",
            multiple: false,
            withCredentials: true,
            beforeUpload: this.beforeUpload,
            fileList: fileList,
            onRemove: this.onRemove
        };
        
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="旅游景点"
                >
                    {getFieldDecorator('title', {
                        initialValue: data.title || '',
                        rules: [{ required: true, message: '请输入旅游景点' }],
                    })(
                    
                        <Input placeholder="请输入旅游景点" style={{ width: '60%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="旅游简介"
                >
                    {getFieldDecorator('subTitle', {
                        initialValue: data.subTitle || '',
                        rules: [{ required: true, message: '请输入旅游简介' }],
                    })(
                    
                        <Input placeholder="请输入旅游简介" style={{ width: '60%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="旅游价格"
                >
                    {getFieldDecorator('price', {
                        initialValue: data.price || '',
                        rules: [{ required: true, message: '请输入旅游价格' }],
                    })(
                    
                        <Input placeholder="请输入旅游价格" style={{ width: '60%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                        label="banner"
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
                <FormItem>
                    <RadioGroup name="radiogroup" onChange={this.handleSwitch} defaultValue={1} style={{textAlign: 'left',  margin: '20px'}}>
                        <Radio value={1}>行程亮点</Radio>
                        <Radio value={2}>行程安排</Radio>
                        <Radio value={3}>费用包括</Radio>
                    </RadioGroup>
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