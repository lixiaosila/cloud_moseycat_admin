import React,{Component} from 'react'
import E from 'wangeditor'

class Custom extends Component {
    state = {
        data: [],
        editor: '',
        editorContent: "<div>12<img src='https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1903728600,852547729&fm=173&app=25&f=JPEG?w=218&h=146&s=BA8224C1184306574CFC6197030050C2' />34</div>"
    }
    componentDidMount() {
        this.getEditConfig();
    }
    getEditConfig() {
        const elem = this.refs.editorElem;
        this.editor = new E(elem)
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.customConfig.onchange = html => {
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
        setTimeout(() => {
            this.editor.txt.html(this.state.editorContent);  
        }, 2000);
    }
    clickHandle = () => {
        console.log(this.state.editorContent)
    }
    render() {
        return (
            <div>
                <div ref="editorElem" style={{textAlign: 'left'}}></div>
                <div onClick={this.clickHandle}>确定</div>
            </div>
        );
    }
}

export default Custom;
