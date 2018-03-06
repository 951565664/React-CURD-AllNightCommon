/**
 * @description: 查询条件组件
 * @author: GP.
 * @version 2.0 alpha
 */
/***********MyTableTopForm1.0********* */
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import styles from './index.less';
import { Select, Input, TreeSelect, DatePicker } from 'antd';
import VtxGrid from '../../VtxCommon/VtxGrid/VtxGrid';
import AllNightCommonRangePicker from '../AllNightCommonRangePicker';
import VtxYearPicker from '../../VtxCommon/VtxDate/VtxYearPicker';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const MonthPicker = DatePicker.MonthPicker;

import moment from 'moment';

class TableTopForm extends Component {
  static propTypes = {
    VtxGridProps: PropTypes.shape({
      confirm: PropTypes.func,
      clear: PropTypes.func,
      hiddenMoreButtion: PropTypes.bool,
      showAll: PropTypes.bool,
    }),
    dataArr: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.selectProps = {
      showSearch: true,
      allowClear: true,
      optionFilterProp: 'children',
    };
    this.inputProps = {}
    this.treeSelectProps = {
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      treeDefaultExpandAll: true,
      allowClear: true,
      style: { width: '100%' },
      showSearch: true,
      // treeCheckable:true,
      // showCheckedStrategy:TreeSelect.SHOW_ALL,
      treeNodeFilterProp: "title",
      // treeCheckStrictly:true,
    }
    this.VtxGridProps = null;
  }

  componentWillMount() {
    let { VtxGridProps = {} } = this.props;
    VtxGridProps = {
      confirm: VtxGridProps.confirm || this.confirm,
      clear: VtxGridProps.clear || this.clear,
      hiddenMoreButtion: VtxGridProps.hiddenMoreButtion ? true : false,
      showAll: VtxGridProps.showAll ? true : false,
      titles: this.props.dataArr instanceof Array ? this.props.dataArr.map(({ label }) => label) : [],
      gridweight: this.props.dataArr instanceof Array ? this.props.dataArr.map(({ gridweight }) => gridweight) : [],
    };
    this.VtxGridProps = VtxGridProps;


  }
  confirm = () => {
    if (typeof (this.props.confirmFunc) === 'function') {
      this.props.confirmFunc()
    } else {
      let { dispatch, modelsName } = this.props;
      dispatch({
        type: `${modelsName}/getTableData`, payload: { currentPage: 1 }
      })
    }
  }

  clear = () => {
    if (typeof (this.props.clearFunc) === 'function') {
      this.props.clearFunc()
    } else {
      let { dispatch, modelsName } = this.props;

      dispatch({
        type: `${modelsName}/clearSearchForm`, payload: {}
      });
      dispatch({
        type: `${modelsName}/getTableData`, payload: {}
      });
    }

  }
  updateItem = (obj) => {
    if (typeof (this.props.updateItem) === 'function') {
      this.props.updateItem(obj)
    } else {
      let { dispatch, modelsName } = this.props;
      dispatch({
        type: `${modelsName}/fetchSearchForm`, payload: {
          ...obj
        }
      })

    }

  }
  getContentJsx = (item, key) => {
    let { content, listAndTree = {} } = this.props;
    let updateItem = this.updateItem;
    let rts = null;
    switch (item.contType) {
      case 'select': {
        rts = <Select
        {...{...this.selectProps,...item.otherProps}}

          style={{ width: '100%', ...item.style }}
          value={
            content[item.contValue] || undefined
          }
          key={key}
          onChange={(val) => {
            updateItem({ [item.contValue]: val });
          }}
          placeholder={item.placeholder || '请选择'+item.label}
        >
          {
            item.list instanceof Array ? item.list.map(
              (item, key) => {
                return <Option key={item.id}>{item.name}</Option>
              }
            ) : (
                (item.dataKey && listAndTree[item.dataKey] instanceof Array) ? listAndTree[item.dataKey].map(
                  (item, key) => {
                    return <Option key={item.id}>{item.name}</Option>
                  }
                ) : null
              )

          }
        </Select >
        break;
      }
      case 'input': {
        rts = <Input {...{...this.inputProps,...item.otherProps}} value={content[item.contValue] || undefined} placeholder={item.placeholder || '请输入'+item.label}
          key={key}
          onChange={(e) => {
            updateItem({ [item.contValue]: e.target.value });
          }}
        />
        break;
      }
      case 'treeSelect': {
        rts = <TreeSelect  {...{...this.treeSelectProps,...item.otherProps}} placeholder={item.placeholder || '请选择'+item.label} key={key}
          value={content[item.contValue] || undefined} treeData={item.treeData || listAndTree[item.dataKey]}
          multiple={item.multiple ? item.multiple : false}
          onChange={(value, label, extra) => {
            updateItem({ [item.contValue]: value });
          }}
        />
        break;
      }
      case 'rangePicker': {
        //if contValue是个数组，else key 对应的变量是个数组
        if (item.contValue instanceof Array && item.contValue.length >= 2) {
          rts = <RangePicker style={{ width: '100%' }} key={key} allowClear={item.allowClear === undefined?true:item.allowClear}
            value={[
              content[item.contValue[0]] ? moment(content[item.contValue[0]]) : undefined,
              content[item.contValue[1]] ? moment(content[item.contValue[1]]) : undefined,
            ]}
            onChange={(dates, dateStrings) => {
              updateItem({
                [item.contValue[0]]: dateStrings[0],
                [item.contValue[1]]: dateStrings[1]
              });
            }
            }
            disabledDate={typeof(item.disabledDate)==='function'?item.disabledDate:null}
            ranges={item.ranges?item.ranges:null}
            format={item.format || "YYYY-MM-DD"}
            showTime={item.showTime || 'false'}
          />
        } else {
          rts = <RangePicker style={{ width: '100%' }} key={key} allowClear={item.allowClear === undefined?true:item.allowClear}
            value={[
              content[item.contValue] ? (content[item.contValue][0] ? moment(content[item.contValue][0]) : undefined) : undefined,
              content[item.contValue] ? (content[item.contValue][1] ? moment(content[item.contValue][1]) : undefined) : undefined,
            ]}
            onChange={(dates, dateStrings) => {
              updateItem({ [item.contValue]: dateStrings });
            }
            }
            ranges={item.ranges?item.ranges:null}
            disabledDate={typeof(item.disabledDate)==='function'?item.disabledDate:null}

          />
        }
        break;
      }
      case 'monthRangePicker': {

        rts = <div style={{ width: '100%' }} key={key}>
          <div style={{ display: 'inline-block', width: '47%', }}>
            <MonthPicker
              allowClear={item.allowClear || false}
              value={(item.contValue instanceof Array && content[item.contValue[0]]) ? moment(content[item.contValue[0]]) : undefined}
              placeholder={item.placeholder instanceof Array ? item.placeholder[0] : undefined}
              disabledDate={!item.isNoNeedDdisabledDate ? (item.disabledDate === 'function' ? item.disabledDate : (startValue) => {

                const endValue = moment(content[item.contValue[1]]);
                if (!startValue || !endValue) {
                  return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
              }) : null}
              onChange={
                (dates, dateStrings) => {
                  updateItem({ [item.contValue[0]]: dateStrings });
                }
              }
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ display: 'inline-block', minWidth: '15px', width: '6%', textAlign: 'center' }}>至</div>
          <div style={{ display: 'inline-block', width: '47%', }}>
            <MonthPicker
              allowClear={item.allowClear || false}
              value={(item.contValue instanceof Array && content[item.contValue[1]]) ? moment(content[item.contValue[1]]) : undefined}
              placeholder={item.placeholder instanceof Array ? item.placeholder[1] : undefined}
              disabledDate={!item.isNoNeedDdisabledDate ? (item.disabledDate === 'function' ? item.disabledDate : (endValue) => {
                const startValue = moment(content[item.contValue[0]]);
                let curValue = moment(moment().format('YYYY-MM'));

                if (!startValue || !endValue) {
                  return false;
                }
                return !(endValue.valueOf() >= startValue.valueOf() && endValue.valueOf() <= curValue.valueOf());
              }) : null}
              onChange={(dates, dateStrings) => {
                updateItem({ [item.contValue[1]]: dateStrings });
              }
              }
              style={{ width: '100%' }}
            />
          </div>
        </div>
        break;
      }
      case 'dataPicker': {
        rts = <DatePicker {...{...item.otherProps}} style={{ width: '100%' }} key={key}
          value={content[item.contValue] ? moment(content[item.contValue]) : undefined}
          onChange={(dates, dateStrings) => {
            updateItem({ [item.contValue]: dateStrings });
          }
        }
        />
        break;
      }
      case 'allNightCommonRangePicker': {
        rts = <AllNightCommonRangePicker {...{...item.otherProps}} key={key} allowClear={item.allowClear === undefined?true:item.allowClear}
        value={[
          content[item.contValue[0]] ? moment(content[item.contValue[0]]) : undefined,
          content[item.contValue[1]] ? moment(content[item.contValue[1]]) : undefined,
        ]}
        onChange={(dates, dateStrings) => {
          updateItem({
            [item.contValue[0]]: dateStrings[0],
            [item.contValue[1]]: dateStrings[1]
          });
        }
        }
        disabledDate={typeof(item.disabledDate)==='function'?item.disabledDate:null}
        ranges={item.ranges?item.ranges:null}
        rangeType={item.rangeType}
        />
        break;
      }
      case 'yearPicker': {
        rts = <VtxYearPicker style={{ width: '100%' }} key={key}
          value={content[item.contValue] || ''}
          onChange={(dates, dateStrings) => {
            updateItem({ [item.contValue]: dateStrings });
          }}
          allowClear={item.allowClear==='undefined'?true:item.allowClear} 
          disabledDate={typeof(item.disabledDate)==='function' ?item.disabledDate:null}
        />
        break;
      }
      default:
        break;
    }
    return rts;
  }
  render() {
    let { dataArr, } = this.props;
    return (
      <VtxGrid {...this.VtxGridProps}>
        {
          dataArr instanceof Array && dataArr.map((item, key) => { return this.getContentJsx(item, key) })
        }
      </VtxGrid>
    )
  }
}
export default connect()(TableTopForm);