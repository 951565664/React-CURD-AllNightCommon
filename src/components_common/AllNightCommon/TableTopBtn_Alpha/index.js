/**
 * @author GP
 * @description tableTopBtn 2.0 alpha
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import {hashHistory} from 'react-router';
import { Button, Menu, Dropdown, Icon,notification,message } from 'antd';
import styles from './index.less';
import ImportUploadModal from '../UploadModal/UploadModal.js';

class TableTopBtn extends Component {
    static propTypes = {
        btnTypes: PropTypes.array.isRequired,

        ImportItemProps: PropTypes.shape({
            uploadProps: PropTypes.shape({
                action: PropTypes.string,
                downLoadURL: PropTypes.string,
            }),

            templateSrc: PropTypes.string,
        }),
        importModalOKClick: PropTypes.func,//导入成功回调函数
    }
    constructor(props) {
        super(props);
        this.state = {
            isNeedImportModal: false,//是否需要导入

            importModalIsShow: false,//导入是否显示
            fileListVersion: 0,
            fileList: [],

            isNeedExportMenu: true,//是否需要导出
        }
    }

    componentWillMount() {
        this.isNeedImportModal(this.props.btnTypes);
        
    }
    isNeedImportModal = (btnTypes) => {
        let _newState = {};
        
        if (btnTypes.indexOf('import') !== -1) {
            _newState.isNeedImportModal = true;
        }
        if (btnTypes.indexOf('export') !== -1) {
            _newState.isNeedExportMenu = true;
        }
        this.setState({
            ..._newState
        })
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.btnTypes.length != nextProps.btnTypes.length){
            this.isNeedImportModal(nextProps.btnTypes);
        }
    }
    
    /* 展示导入模态框 */
    importModalOnShow = () => {
        
        this.setState({
            importModalIsShow: true
        })
    }
    /* 导入隐藏模态框 */
    importModalOnCancel = () => {
        this.setState({
            importModalIsShow: false
        })
    }
    /* 清空导入模态框 */
    importModalClearClick = (files) => {
        this.setState({
            fileList: [],
            fileListVersion: this.state.fileListVersion + 1,
        })
    }
    /* 确定导入模态框 */
    importModalOKClick = (files) => {
        let me = this;
        /* 设置一个回调，给model 用 */
        let callBack = (
            {
            routerNamespace,
            requestParams,
            operateMessage,
            operateSuccess
            }
        ) => {
            me.importModalOnCancel();
            me.importModalClearClick();

            me.openImportView({
                routerNamespace,
                requestParams,
                operateMessage,
                operateSuccess
            });


        }
        if (typeof (this.props.importModalOKClick) === 'function') {
            this.props.importModalOKClick(files, callBack);
            /* if 成功，清楚，并关闭，如果失败清空 */
        }
    }

    openImportView = ({routerNamespace,requestParams,operateMessage,operateSuccess}) => {
        operateSuccess ? message.info(operateMessage) : message.error(operateMessage);
        /* 导入信息查看 功能 */
        let arg = window.location.hash.split('?')[1];
        const mark = requestParams.mark;
        notification.config({
            placement: 'bottomRight',
        });
        notification.open({
            message: <div style={{ color: "#0000FF", cursor: 'pointer' }}
                onClick={() => {
                    hashHistory.push({
                        pathname: `/myImportView?${arg}&mark=${mark}&routerNamespace=${routerNamespace}`,
                        query: {
                            //tenantId:
                            //mark:mark,
                            //routerNamespace:routerNamespace,
    
                        }
                    })
                }}>查看信息</div>,
            description: operateMessage,
        })
    }
    /* 上传回调 */
    uploadOnSuccess = (files) => {
        this.setState({
            fileList: [...this.state.fileList, files]
        })
    }
    /* 导出点击事件 */
    exportMenuClick = ({ key: menuKey }) => {
        typeof (this.props.exportOnclick) === 'function' && this.props.exportOnclick(menuKey);

    }


    render() {
        const {
            btnArrs,
            btnTypes,
            addOnclick,
            deletesOnclick,
            backOnclick,
            ImportItemProps = {},
        } = this.props;

        var _btnArrs = [];
        var _dropDown = null;

        const exportMenu = (
            <Menu onClick={this.exportMenuClick}>
                <Menu.Item key="selectedRows">导出选中行</Menu.Item>
                <Menu.Item key="currentPage">导出当前页</Menu.Item>
                <Menu.Item key="all">导出全部</Menu.Item>
            </Menu>
        );

        if (btnTypes != undefined) {
            btnTypes.map(
                (item, key) => {
                    item == "add" && _btnArrs.push(
                        {
                            icon: "file-add",
                            onClick: addOnclick ? addOnclick : () => { },
                            name: "新增",
                            type: "default",
                            // shape:
                            loading: false,
                        }
                    );
                    item == "deletes" && _btnArrs.push(
                        {
                            icon: "delete",
                            onClick: deletesOnclick ? deletesOnclick : () => { },
                            name: "删除",
                            type: "default",
                            loading: false,
                        }
                    );
                    if (item == "import") {
                        
                        _btnArrs.push(
                            {
                                icon: "cloud-upload-o",
                                onClick: this.importModalOnShow,
                                name: "导入",
                                type: "default",
                                loading: false,
                            }
                        );
                    }
                    if (item == "export") {
                        _dropDown = <Dropdown overlay={exportMenu} trigger={["click"]}>
                            <Button icon="export">
                                导出 <Icon type="down" />
                            </Button>
                        </Dropdown>;
                    };
                    item == "back" && _btnArrs.push(
                        {
                            icon: "rollback",
                            onClick: backOnclick ? backOnclick : () => { },
                            name: "返回",
                            type: "default",
                            loading: false,
                        }
                    );
                }
            )

        }
        if (btnArrs && btnArrs.length > 0) {
            {
                btnArrs.map((item, key) => {
                    _btnArrs.push({ ...item });
                })
            }
        }

        let _ImportItemProps = null;
        //导入功能模态框
        
        if (this.state.isNeedImportModal) {
            
            _ImportItemProps = {
                templateSrc: ImportItemProps.templateSrc || '',
                modal: {
                    title: `${this.props.title || ''} > 导入`,
                    visible: this.state.importModalIsShow,
                    onCancel: this.importModalOnCancel,
                    width: 920,
                    maskClosable: false,
                },
                clearClick: this.importModalClearClick,
                OkClick: this.importModalOKClick,

                upload: {
                    fileList: this.state.fileList,   // 重要：保存在数据store的文件数组
                    multiple: true,
                    fileListVersion: this.state.fileListVersion,   // 重要：保存在数据store的文件数组
                    onSuccess: this.uploadOnSuccess
                }
            }
        }
        return (
            <div className={styles.myTableTopBtn}>
                {
                    (_btnArrs && _btnArrs.length > 0) && _btnArrs.map(
                        (item, key) => (
                            <Button
                                key={key} icon={item.icon ? item.icon : null}
                                type={item.type ? item.type : "default"}
                                onClick={item.onClick ? item.onClick : () => { console.error("TableTopBtn:onClick参数没有") }}
                                shape={item.shape ? item.shape : null}
                                loading={item.loading !== undefined ? item.loading : false}>{item.name ? item.name : null}
                            </Button>
                        )
                    )

                }

                {
                    /* 导出 */
                    _dropDown ? _dropDown : null
                }
                {
                    /* 导入 */
                    _ImportItemProps && <ImportUploadModal {..._ImportItemProps} />
                }
            </div>
        )
    }
}


export default connect()(TableTopBtn);