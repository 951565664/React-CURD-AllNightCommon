/**
 * @description: 查看页面组件
 * @author: GP.
 * @维护：GZ
 */
import React from 'react';
import VtxModal from '../../VtxCommon/VtxModal/VtxModal';
import VtxDataGrid from '../../VtxCommon/VortexDatagrid/VortexDatagrid';
import ValidationCpt from '../ValidationCpt';
import styles from '../Item.less';
import { Collapse ,Input,Breadcrumb,Button,Modal,TreeSelect,Spin} from 'antd';
import { formValidation, ActionURL, DownloadURL } from '../../../utils/toolFunc';
const { TextArea } = Input;
const Panel = Collapse.Panel;
const ViewItem = (props) => {
  const { modalProps, contentProps, isNeedCollapse = false, defaultActiveKey = [], itemArrs = null ,isNeedApprovalBtns=false,approvalHandles={},manageStaffTreeData} = props;
  function rtnContentJsxFun(item,key) {
    switch (item.parentDom) {
     
      case 'img':
        return <div className={styles.contentImg} key={key}>
          <img src={contentProps[item.valueKey]} />
        </div>
        break;
      case 'imgs':
        return <div className={styles.contentImg} key={key}>
          {

            contentProps[item.valueKey] instanceof Array && contentProps[item.valueKey].map((item,key)=>{
              return <a key={key} target="_blank" href={DownloadURL+item.id}><img src={DownloadURL+item.id} /></a>
            })
          }

        </div>
        break;
      case 'color':{

      
        return <div className={styles.contentColor} key={key}>
           <div key={key} style={{backgroundColor:contentProps[item.valueKey] || '#FFF'}}></div>
        </div>
        break;
      }
      case 'file':
        return <div className={styles.contentFile} key={key}>
          {
            contentProps[item.valueKey] instanceof Array && contentProps[item.valueKey].map((item,key)=>{
              return <a key={key} target="_blank" href={DownloadURL+item.id}>{item.name}</a>
            })
          }
        </div>
        break;
      case 'breadcrumb':
        return <Breadcrumb separator="->" style={{ display: 'inline-block' }} key={key}>
          {
            contentProps[item.valueKey] instanceof Array && contentProps[item.valueKey].map((item, key) => <Breadcrumb.Item key={key}> {item.name}</Breadcrumb.Item>)
          }
        </Breadcrumb>
        break;
      case 'reviewCpt':
        return <div  className={styles.textareaCt} key={key}>{
          contentProps[item.valueKey] && contentProps[item.valueKey].map(
            (item, key) => (
              <div  className={styles.textareaCt_row} key={key}>
                                        <span  className={styles.textareaCt_staff} >
                                        {item.staffName}：
                                        </span>
                {item.memo}
              </div>
            )
          )
        }</div>

        break;
      case 'money':
        return (<div key={key}>{
          contentProps[item.valueKey] && contentProps[item.valueKey].map(
            (item, key) => (
              <div  className={styles.layout} key={key}>
                <div className={styles.label}>
                  {item.maintainFeeTypeName}：
                </div>
                {
                  item.detailTypeList.map(
                    (item, key) => (
                      <div  className={styles.layoutmoney} key={key}>
                        <div className={styles.label} key={key}>
                          {item.name}(元)：
                        </div>
                        {item.price}
                      </div>
                    )
                  )
                }
              </div>
            )
          )
        }</div>);
        break;
      case 'vtxDataGrid':{
        
        return (<div className={styles.cptWrapper} key={key} style={item.boxStyle || {}}><VtxDataGrid {...contentProps[item.valueKey]} /></div>);
          break;
      }
      default:
        return <span key={key}> {contentProps[item.valueKey]} </span>
    }
    return
  }
  let loading = contentProps.loading == undefined?false:contentProps.loading;
  return (
    <VtxModal {...modalProps}>
      <Spin spinning={loading}>
        {
          !!isNeedCollapse
            ?
            (<Collapse defaultActiveKey={defaultActiveKey} >
              {
                !!itemArrs && itemArrs.map(
                  (item, key) => (
                    <Panel header={item.header} key={key}>
                      <div className={styles.formWrapper}>
                        {
                          !!item.children && item.children.map(
                            (item, key) => {
                              return (
                              item.colon?rtnContentJsxFun(item,key):
                                <div className={item.isLayout ? styles.layout : styles.halfLayout} key={key}>

                                  {
                                    item.label !== undefined 
                                    ?
                                    <div className={item.isRequired ? styles.requiredLabel : styles.label}>
                                      {item.label}：
                                    </div>
                                    :
                                    null
                                  }
                                  {
                                    rtnContentJsxFun(item,key)
                                  }

                                </div>
                                )
                            }
                          )
                        }
                      </div>
                    </Panel>
                  )
                )
              }
            </Collapse>)
            :
            <div className={styles.formWrapper}>
              {
                !!props.itemArrs && props.itemArrs.map(
                  (item, key) => {
                    return (
                      <div className={item.isLayout ? styles.layout : styles.halfLayout} key={key}>
                        {
                          item.label !== undefined 
                          ?
                          <div className={item.isRequired ? styles.requiredLabel : styles.label}>
                            {item.label}：
                          </div>
                          :
                          null
                        }
                        {
                          rtnContentJsxFun(item,key)
                        }
                      </div>
                    )
                  }
                )
              }
            </div>
        }
        {isNeedApprovalBtns &&<ApprovalBtns approvalHandles={approvalHandles} approvalRecordId={contentProps.approvalRecordId} manageStaffTreeData={manageStaffTreeData}></ApprovalBtns>
        }
      </Spin>
    </VtxModal>
  )
}
ViewItem.propTypes = {
  approvalHandles: React.PropTypes.func
};
export default ViewItem;



//下方按钮
class ApprovalBtns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible: false,passStaffId:undefined,comment:undefined};
    this.treeSelectProps = {
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      treeDefaultExpandAll: true,
      allowClear: true,
      style: { width: '100%' },
      showSearch: true,
      treeNodeFilterProp:"title"
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {

    if(formValidation({ checkType: 'required', checkVal: this.state.passStaffId })){
      this.setState({
        comment: '',
        passStaffId:undefined,
      });
      this.props.approvalHandles(this.props.approvalRecordId,'zj',this.state.comment,this.state.passStaffId)
      this.handleCancel();
    }
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  render() {
    let manageStaffTreeData = this.props.manageStaffTreeData || [];
    let comment = this.state.comment;
    return (
      <div>
        <div className={styles.formWrapper}>
          <div className={styles.label}>
            我的评论：
          </div>
          <div className={styles.textareaCt}>

                    <TextArea rows={4} value={this.state.comment} onChange={(e) => {
                      this.setState({
                        comment: e.target.value,
                      });
                    }} placeholder="请输入评论内容" />
          </div>
        </div>
        <div className={styles.approvalBtns}>
          <Button type="primary" onClick={
            ()=>{
              this.setState({
                comment: '',
                passStaffId:undefined,
              });
              this.props.approvalHandles(this.props.approvalRecordId,'ty',comment)
            }
          }>同意</Button>
          <Button type="primary" onClick={
            ()=>{
              this.setState({
                comment: '',
                passStaffId:undefined,
              });
              this.props.approvalHandles(this.props.approvalRecordId,'jj',comment)
            }
          }>拒绝</Button>
          <Button type="primary" onClick={this.showModal}>转交</Button>
          <Modal
            title="选择转交人"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            maskClosable={false}
          >
            <div className={styles.modelContent}>
              <div className={styles.requiredLabel}>
                选择人员：
              </div>
              <ValidationCpt errorMsg={["必填项",]}
                               validated={[
                                 formValidation({ checkType: 'required', checkVal: this.state.passStaffId }),
                               ]
                               }>
                <TreeSelect   {...this.treeSelectProps} placeholder={"请选择人员"}
                              treeData={manageStaffTreeData}
                              value={this.state.passStaffId}
                              onChange={(value, label, extra) => {

                                if (extra.triggerNode) {
                                  if (extra.triggerNode.props.nodeType == 'staff') {
                                    this.setState({
                                      passStaffId: value,
                                    });
                                  }
                                } else {
                                  this.setState({
                                    passStaffId: value,
                                  });
                                }
                              }}
                />
              </ValidationCpt>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}