/**
 * @description: InlineDataGrid 组件，用于行内增删改查
 * @author: GP.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable';
const { List } = Immutable;
import VtxModal from '../../../components/VtxCommon/VtxModal/VtxModal';
import VortexDatagrid from '../../../components/VtxCommon/VortexDatagrid/VortexDatagrid';

import { Table, Input, Button, Select, Switch } from 'antd';
import styles from '../Item.less';


export default class InlineDataGrid extends Component {
  static propTypes = {
    itemArrs: PropTypes.any,
    isNeedAddBtn: PropTypes.bool,
    isNeedDeleteBtn: PropTypes.bool,
    modalProps: PropTypes.shape({
      title: PropTypes.string.isRequired,
      visible: PropTypes.bool.isRequired,
      maskClosable: PropTypes.bool,
      onCancel: PropTypes.func.isRequired,
      width: PropTypes.number,
    }),
  }
  constructor(props) {
    super(props);

    this.state = {
      itemArrs: [],
      isNeedAddBtn: false,
      isNeedDeleteBtn: false,
      accessControlMdata: {
        isCanEdit: true,//处理边界权限
        ...this.props.accessControlMdata,
      }
    };

  }

  componentWillMount() {
    this.setState({
      itemArrs: this.props.itemArrs instanceof Array ? this.props.itemArrs : this.state.itemArrs,
      isNeedAddBtn: this.props.isNeedAddBtn || this.state.isNeedAddBtn,
      isNeedDeleteBtn: this.props.isNeedDeleteBtn || this.state.isNeedDeleteBtn,
    })
  }

  componentWillReceiveProps = (nextProps) => {
    // if (this.props.itemArrs.length != nextProps.itemArrs.length || !(List(nextProps.itemArrs)).equals(List(this.props.itemArrs))) {
    //   this.setState({
    //     itemArrs: nextProps.itemArrs,
    //   });
    // }
    if (this.state.isNeedAddBtn !== nextProps.isNeedAddBtn) {
      this.setState({
        isNeedAddBtn: nextProps.isNeedAddBtn,
      });
    }
    if (this.state.isNeedDeleteBtn !== nextProps.isNeedDeleteBtn) {
      this.setState({
        isNeedDeleteBtn: nextProps.isNeedDeleteBtn,
      });
    }

  }
  // shouldComponentUpdate = (nextProps, nextState) => {

  // }
  addOnItemClick = () => {
    if (typeof (this.props.addOnItemClick) === 'function') {

      this.props.addOnItemClick();
    }
  }
  deleteItemOnClick = (index) => {
    if (typeof (this.props.deleteItemOnClick) === 'function') {
      this.props.deleteItemOnClick(index);
    }
  }
  updateItem = (changeObj, index) => {
    if (typeof (this.props.updateItem) === 'function') {
      this.props.updateItem(changeObj, index);
    }
  }


  getRenderContent = ({ record, index, dataIndex, contType, other: itemOther }) => {
    let { contentProps = {}, } = this.props
    //if 编辑权限有，根据conType 来判断，else 编辑权限无，直接全部text走
    if (!!this.state.accessControlMdata.isCanEdit) {

      switch (contType) {
        case 'text': {
          return record[dataIndex]
        }
        case 'input': {
          let { changeRegExp } = itemOther;
          return <Input value={record[dataIndex]} onChange={(e) => {
            if (!changeRegExp || (!!changeRegExp && changeRegExp.test(e.target.value))) {
              this.updateItem({ [dataIndex]: e.target.value }, index)
            }
          }
          } />
        }
        case 'select': {
          return (
            <Select value={record[dataIndex] || (contentProps[itemOther.listDataKey] instanceof Array ? contentProps[itemOther.listDataKey][0].id : '暂无数据')} style={{ width: '100%' }} allowClear={false} onChange={(value) => {
              this.updateItem({
                [dataIndex]: value,
              }, index);
            }}
            >
              {
                contentProps[itemOther.listDataKey] instanceof Array && contentProps[itemOther.listDataKey].map((item) => {
                  return <Option key={item.id} title='test'>{item.name}</Option>
                })
              }
            </Select>
          )
        }
        case 'switch': {
          return (
            <Switch checked={typeof (record[dataIndex]) === 'string' ? record[dataIndex] === 'true' : record[dataIndex]} checkedChildren="是" unCheckedChildren="否" onChange={(checked) => this.updateItem({ [dataIndex]: checked + '' }, index)} />
          )
        }
        default: {
          return record[dataIndex]
        }
      }
    } else {
      return record[dataIndex]
    }
  }

  render() {
    let { modalProps, contentProps = {}, itemArrs = [] } = this.props

    let { data: dataGridList } = contentProps;
    let rColumns = [
      {
        title: '序号',
        key: -1,
        width: 60,
        render: (text, record, index) => index,
      },
      ...itemArrs.map(({ title, dataIndex, contType, ...other }, key) => ({
        title,
        dataIndex,
        key: key,
        ...other,
        render: (text, record, index) => {
          return this.getRenderContent({ record, index, dataIndex, contType, other });

        }
      })),

    ];
    if (this.props.customBtn instanceof Array && this.props.customBtn.length > 0) {
      rColumns.push({
        title: '操作',
        key: 'action',
        width: 80,
        render: (text, record, index) => (
          <div className={styles.customBtn}>
            {
              this.props.customBtn.map((item, key) => ( typeof(item.render) !== 'function' || (typeof(item.render) === 'function' && item.isRender(text, record, index)))?(
              <span key={key} ><a onClick={()=>{item.onClick(text, record, index)}}>{item.name}</a></span>):null
            )
            }
          </div>
        ),

      });
    }
    let rVortexDatagridProps = {
      autoFit: true,
      columns: rColumns,
      dataSource: dataGridList instanceof Array ? dataGridList : [],
      pagination: false,
    }

    return (
      <VtxModal {...modalProps}>
        {
          this.state.isNeedAddBtn && <Button style={{
            marginBottom: '8px',
          }} onClick={this.addOnItemClick}>新增</Button>
        }
        <Table  {...rVortexDatagridProps} />
      </VtxModal>
    )
  }
}