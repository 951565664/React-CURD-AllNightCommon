import React from 'react';
import styles from './VtxModal.less';

import {Modal,Icon} from 'antd';

function VtxModal(props) {
    let ModalProps = {...props};
    let closable = true;
    if('closable' in props){
        closable = props.closable;
    }
    function renderTitle() {
        return (
            <div className={styles.title} style={{paddingRight: (closable?'32px':'0px')}}>
                <div className={styles.title_name}>
                    {ModalProps.title}
                </div>
                {
                    closable?
                    <div className={styles.close}>
                        <p onClick={ModalProps.onCancel}>
                            <Icon type="close" />
                        </p>
                    </div>:''
                }
            </div>
        );
    }
    let wrapClassName = `${styles.normal} ${ModalProps.wrapClassName}`;
    //在渲染之前 删除有影响的属性
    delete ModalProps.closable;
    delete ModalProps.wrapClassName;
    return (
        <Modal 
            {...ModalProps}
            closable={false}
            title={renderTitle()}
            wrapClassName={wrapClassName}
        >
            {
                ModalProps.children
            }
        </Modal>
    );
}
VtxModal.info = Modal.info;
VtxModal.success = Modal.success;
VtxModal.error = Modal.error;
VtxModal.warning = Modal.warning;
VtxModal.confirm = Modal.confirm;

export default VtxModal;