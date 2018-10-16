import React, {Component} from 'react';
import { Form, Button, Upload, Icon, message, Input, Radio, Select } from 'antd';
import { getScene, addScene, putScene } from '@/server'

// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import 'braft-editor/dist/index.css'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class EditForm extends Component {
    state = {
        data: [],
        editor: '',
        excludeControls:  ['letter-spacing','line-height','code','emoji','superscript','subscript','media'],
        editorState: '',
        featureContent: '',
        travelContent: '',
        feeContent: '',
        currentIndex: 1,
        isLogin: true,
        previewCover: '',
        previewListCover: '',
        titles: [],
        cateId: ''
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
        getScene(params).then(
            res => {
                this.setState(
                    {
                        data: res.data,
                        previewCover: res.data.cover,
                        previewListCover: res.data.listCover,
                        featureContent: res.data.featureContent,
                        travelContent: res.data.travelContent,
                        feeContent: res.data.feeContent,
                        titles: res.data.listTitle,
                        cateId: res.data.cateId == 0 ? '' : res.data.cateId,
                        editorState: BraftEditor.createEditorState(res.data.featureContent)
                    }
                )
            }
        )
    }
    getDefaultPhoto = (type) => {
        let { previewListCover, previewCover } = this.state;
        if(type == 1) {
            if(previewListCover) {
                return(
                    <div className="upload_img_wrap">
                        <img src={previewListCover} className="photo"/>
                        <i title="删除文件" className="close" onClick={this.handlePicClose.bind(this,1)}>
                            <svg viewBox="64 64 896 896" className="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                        </i>
                    </div>
                )
            }
        } else {
            if(previewCover) {
                return(
                    <div className="upload_img_wrap">
                        <img src={previewCover} className="photo"/>
                        <i title="删除文件" className="close" onClick={this.handlePicClose.bind(this,2)}>
                            <svg viewBox="64 64 896 896" className="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                        </i>
                    </div>
                )
            }
        }
        return '';
    }
    handlePicClose = (type) => {
        if(type == 1) {
            this.setState({
                previewListCover: ''
            })
        } else {
            this.setState({
                previewCover: ''
            })
        }
    }
    handleFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(!this.state.isLogin) {
                    message.error('请先登录');
                    return;
                }
                let { previewCover, previewListCover, cateId, featureContent, travelContent, feeContent } = this.state;
                if(!previewCover || !previewListCover) {
                    message.error('请先上传图片！');
                    return;
                }
                if(!cateId) {
                    message.error('请先选择分类！');
                    return;
                }
                if(values.listTitle.length == 0) {
                    message.error('请至少输入1条旅游景点介绍语！');
                    return;
                }
                let { history } = this.props;
                let params = {
                    "title": values.title,
                    "subTitle": values.subTitle,
                    "price": values.price,
                    "featureContent": featureContent,
                    "travelContent": travelContent,
                    "feeContent": feeContent,
                    "cover": previewCover,
                    "listCover": previewListCover,
                    "listTitle": values.listTitle,
                    "cateId": cateId,
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
    beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片尺寸超过2M，建议压缩后上传!');
        }
        return isLt2M;
    }
    handleUploadCover = (info, type) => {
        if (info.file.status === 'done') {
            if(info.file.response.code == 1) {
                message.success(`${info.file.name} 上传成功`);
                this.setState(
                    {
                        previewCover: info.file.response.data[0]
                    }
                )
            }else {
                message.error(`${info.file.name} 上传失败.`);
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    handleUploadListCover = (info, type) => {
        if (info.file.status === 'done') {
            if(info.file.response.code == 1) {
                message.success(`${info.file.name} 上传成功`);
                this.setState(
                    {
                        previewListCover: info.file.response.data[0]
                    }
                )
            }  else {
                message.error(`${info.file.name} 上传失败.`);
            }   
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
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
            this.setState(
                {
                    editorState: BraftEditor.createEditorState(this.state.featureContent)
                }
            )
        }
        if(value == 2) {
            this.setState(
                {
                    editorState: BraftEditor.createEditorState(this.state.travelContent)
                }
            )
        }
        if(value == 3) {
            this.setState(
                {
                    editorState: BraftEditor.createEditorState(this.state.feeContent)
                }
            )
        }
    }
    getTitles = (titles) => {
        return titles.map((item, index) => {
            return  <FormItem
                        required={false}
                        key={index}
                    >
                        <Input placeholder="请输入旅游景点介绍语" value={item} style={{ width: '60%', marginRight: 8 }} onChange={this.handleTitle.bind(this, index)}/>

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
        const basic_titles = form.getFieldValue('listTitle');
        let tpl = '';
        let nextTitles = basic_titles.concat(tpl);
        
        form.setFieldsValue({
            listTitle: nextTitles,
        });   

    }
    handleTitle = (key, e) => {
        const { form } = this.props;
        let titles = form.getFieldValue('listTitle');
        titles[key] = e.target.value;
        form.setFieldsValue({
            listTitle: titles,
        });
    }
    removeTitle = (index) => {
        const { form } = this.props;
        const basic_titles = form.getFieldValue('listTitle');
        if (basic_titles.length === 0) {
            return;
        }
        let nextTitles = basic_titles.filter(
            (key, s_index) => {
                return s_index !== index;
            }
        );
        form.setFieldsValue({
            listTitle: nextTitles,
        });
    }
    handleSelect = (value) => {
        this.setState(
            {
                cateId: value
            }
        )
    }
    handleChange = (editorState) => {
        if(this.state.currentIndex == 1) {
            this.setState({ 
                editorState,
                featureContent: editorState.toHTML()
            })
        }
        if(this.state.currentIndex == 2) {
            this.setState({ 
                editorState,
                travelContent: editorState.toHTML()
            })
        }
        if(this.state.currentIndex == 3) {
            this.setState({ 
                editorState,
                feeContent: editorState.toHTML()
            })
        }
    }
    uploadHandler = (info) => {
        if (info.file.status === 'done') {
            if(info.file.response.code == 1) {
                message.success(`${info.file.name} 上传成功`);
                this.setState(
                    {
                        editorState: ContentUtils.insertMedias(this.state.editorState, [{
                            type: 'IMAGE',
                            url: info.file.response.data[0]
                        }])
                    }
                )
            }  else {
                message.error(`${info.file.name} 上传失败.`);
            }   
            
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
    }


    render() {
        let { data, cateId } = this.state;
        let { handleSelect } = this;
        let selectValue = '';
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4},
            wrapperCol: { span: 14 },
        };

        if(cateId == 1) {
            selectValue = '文化深度'
        }
        if(cateId == 2) {
            selectValue = '亲子游学'
        }
        if(cateId == 3) {
            selectValue = '匠心蜜月'
        }
        if(cateId == 4) {
            selectValue = '精致海岛'
        }
        
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
            value: this.state.editorState,
            onChange: this.handleChange,
            excludeControls: this.state.excludeControls,
            extendControls: extendControls
        }

        getFieldDecorator('listTitle', { initialValue: data.listTitle || [] });
        let titles = getFieldValue('listTitle') || [];

        const props = {
            // action: 'http://moseycat.com:8081/admin/images',
            action: '//b.moseycat.com/admin/images',
            onChange: this.handleUploadListCover,
            beforeUpload: this.beforeUpload,
            multiple: false,
            withCredentials: true,
        };

        const props_detail = {
            // action: 'http://moseycat.com:8081/admin/images',
            action: '//b.moseycat.com/admin/images',
            onChange: this.handleUploadCover,
            beforeUpload: this.beforeUpload,
            multiple: false,
            withCredentials: true,
        };
        
        return (
            <Form>
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
                        label="旅游景点介绍语"
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
                        label="选择景点分类"
                    >
                    <Select value = {selectValue} style={{ width: 120 }} onChange={handleSelect} style={{ width: '60%' }}>
                        <Option value="1">文化深度</Option>
                        <Option value="2">亲子游学</Option>
                        <Option value="3">匠心蜜月</Option>
                        <Option value="4">精致海岛</Option>
                    </Select>
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
                        label="旅游景点banner"
                    >
                    <div style={{ width: '60%' }}>
                        <Upload name="image[]" {...props} >
                            <Button>
                                <Icon type="upload" /> Click to upload
                            </Button>
                        </Upload>
                    </div>
                    {
                        this.getDefaultPhoto(1)
                    }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                        label="旅游详情banner"
                    >
                    <div style={{ width: '60%' }}>
                        <Upload name="image[]" {...props_detail} >
                            <Button>
                                <Icon type="upload" /> Click to upload
                            </Button>
                        </Upload>
                    </div>
                    {
                        this.getDefaultPhoto(2)
                    }
                </FormItem>
                <FormItem>
                    <RadioGroup name="radiogroup" onChange={this.handleSwitch} defaultValue={1} style={{textAlign: 'left',  margin: '20px'}}>
                        <Radio value={1}>行程亮点</Radio>
                        <Radio value={2}>行程安排</Radio>
                        <Radio value={3}>费用包括</Radio>
                    </RadioGroup>
                    <div style={{ border: '1px solid #c0c2c4', margin: '0 20px'}}>
                        <BraftEditor {...editorProps}/>
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