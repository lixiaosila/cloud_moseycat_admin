import React,{Component} from 'react'
import E from 'wangeditor'

class Guider extends Component {
    state = {
        data: [],
        editorContent: ""
    }
    componentDidMount() {
        this.getEditConfig();
    }
    getEditConfig() {
        const elem = this.refs.editorElem;
        const editor = new E(elem)
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
          this.setState({
            editorContent: html
          })
        };

        editor.customConfig.menus = [
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
        editor.customConfig.FontSize = {
            1: '10px',
            2: '13px',
            3: '16px',
            4: '19px',
            5: '22px',
            6: '25px',
            7: '28px'
        };
        editor.customConfig.uploadImgServer = '/upload';
        editor.create();
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

export default Guider;
