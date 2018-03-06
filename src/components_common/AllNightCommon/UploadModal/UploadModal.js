/**
 * @author GP
 * @description 导入模态框
 */
import React from 'react';
import {Modal,Button} from 'antd';
import Upload from './Upload';

class UploadModal extends React.Component{
    constructor(props){
        super(props)
        this.state={
            fileList: this.props.upload.fileList || [],
        };
    }
    getSynFileList(props){
        let t =this;
        props = props||this.props;
        let processedFileList = props.fileList || [];
        // 单文件模式只取第一个
        if(props.mode=='single' && processedFileList.length>1){
            processedFileList = [processedFileList[0]];
        }
        processedFileList = processedFileList.map((item, index)=>{
            // 将外部传入的简易文件数组处理成为组件需要的数组结构
            if(item.name===undefined || item.id===undefined){
            }
            let itemURL = item.url || t.downLoadURL+item.id;
            return {
                ...item,
                uid: -1-index,
                status: 'done',
                url:itemURL,
                thumbUrl: itemURL,
            }
        })
        return processedFileList;
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            fileList: this.getSynFileList(nextProps.upload)
        });

    }

    render(){
        let t = this;
        let ulProps = {
            ...t.props.upload,
            onSuccess(file){
                if(t.props.upload.mode=='single'){
                    t.setState({
                        fileList:[file]
                    });
                }
                else{
                    t.setState({
                        fileList:[...t.state.fileList, file]
                    });
                }
                if(typeof(t.props.upload.onSuccess) =='function'){
                    t.props.upload.onSuccess(file);
                }
            },
            onError(res){
                if(typeof(t.props.upload.onError) =='function'){
                    t.props.upload.onError(res);
                }
            },
            onRemove(file){
                t.setState({
                    fileList: t.state.fileList.filter((item)=>item.id!=file.id)
                });
                if(typeof(t.props.upload.onRemove) =='function'){
                    t.props.upload.onRemove(file);
                }
            },
            // accept:'application/zip,.zip',
            // accept:'image/png',

        }

        let mdProps = {
            title: "上传文件",

            ...t.props.modal,
            footer:[
                <Button key='clear' type="default" onClick={() => {
                    if(typeof(t.props.clearClick)=='function'){
                        t.props.clearClick(t.state.fileList);
                    }

                }}>清空</Button>,
                <Button key='template' type="primary" onClick={() => {
                    window.open(t.props.templateSrc);
                }}>下载模板</Button>,
                <Button key='import' type="primary" onClick={() => {

                    if(typeof(t.props.OkClick)=='function'){
                        t.props.OkClick(t.state.fileList);
                    }
                }}>导入</Button>
            ],
        }
        return (
            <Modal {...mdProps}>
                <Upload {...ulProps}/>
                {
                    typeof(t.props.modal.setContent) =='function'?
                    t.props.modal.setContent(t.state.fileList)
                    : null
                }
            </Modal>
        )
    }
}

export default UploadModal;
