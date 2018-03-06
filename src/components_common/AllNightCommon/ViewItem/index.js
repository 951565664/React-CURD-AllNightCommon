/**
 * @name 查看组件
 * @author: GP.
 * @version 2.0
 * @description: 精简了。把特殊的都拿出去，特殊的单独写一个。
 */
import React from 'react';
import VtxModal from '../../VtxCommon/VtxModal/VtxModal';
import VtxDataGrid from '../../VtxCommon/VortexDatagrid/VortexDatagrid';
import Map from '../../../components/VtxCommon/Map/Map';
import styles from '../Item.less';

import { Collapse, Input, Breadcrumb, Button, Modal, TreeSelect, Spin } from 'antd';
import { DownloadURL } from '../../../services/remoteData';
const { TextArea } = Input;
const Panel = Collapse.Panel;
const ViewItem = (props) => {
  const { modalProps, contentProps, isNeedCollapse = false, defaultActiveKey = [], itemArrs = null } = props;
  function rtnContentJsxFun(item, key) {
    switch (item.parentDom) {
      case 'img':
        return (
          <div className={styles.contentImg} key={key}>
            {
              /* 判断是否是个数组，如果是个数组那么便利，否则直接返回单个 */
              contentProps[item.valueKey] instanceof Array ?
                contentProps[item.valueKey].map(
                  (item, key) => {
                    return (
                      <a key={key} target="_blank" href={DownloadURL + item.id}><img src={DownloadURL + item.id} /></a>
                    )
                  }
                ) 
                : 
                <img src={contentProps[item.valueKey]}/>
            }
          </div>
        )
        break;
      case 'color': {
        return (
          <div className={styles.contentColor} key={key}>
            <div key={key} style={{ backgroundColor: contentProps[item.valueKey] || '#FFF' }}></div>
          </div>
        )
        break;
      }
      case 'file':
          let _fileList = contentProps[item.valueKey]?(contentProps[item.valueKey] instanceof Array ? contentProps[item.valueKey] : [contentProps[item.valueKey]]):undefined;
          return (
          <div className={styles.contentFile} key={key}>
            {

              _fileList && _fileList.map((item, key) => {
                return <a key={key} target="_blank" href={DownloadURL + item.id}>{item.name}</a>
              }) 
            }
          </div>
        )
        break;
      case 'breadcrumb':
        return (
          <Breadcrumb separator={item.separator || "->"} style={{ display: 'inline-block' }} key={key}>
            {
              [
                contentProps[item.valueKey] instanceof Array && contentProps[item.valueKey].map((item, key) => <Breadcrumb.Item key={key}> {item.name}</Breadcrumb.Item>),
                item.valueKey instanceof Array && item.valueKey.map((item, key) => <Breadcrumb.Item key={key}> {contentProps[item]}</Breadcrumb.Item>)

              ]
            }
          </Breadcrumb>
        )
        break;
      case 'vtxDataGrid': {
        return (
          <div className={styles.cptWrapper} key={key} style={item.boxStyle || {}}>
            <VtxDataGrid {...contentProps[item.valueKey]} />
          </div>
        );
        break;
      }
      case 'map': {
        return (
          <div className={styles.cptWrapper} key={key} style={item.boxStyle || {}}>
             <Map
                {...contentProps[item.valueKey]}
            />
          </div>
        );
        break;
      }
      default:
        return <span key={key}> {contentProps[item.valueKey]} </span>
    }
    return
  }
  let loading = contentProps.loading == undefined ? false : contentProps.loading;
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
                              /* 判断是否需要外面的样式 */
                              return (
                                item.colon
                                ?
                                rtnContentJsxFun(item, key) :
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
                                    rtnContentJsxFun(item, key)
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
                          rtnContentJsxFun(item, key)
                        }
                      </div>
                    )
                  }
                )
              }
            </div>
        }
      </Spin>
    </VtxModal>
  )
}

export default ViewItem;