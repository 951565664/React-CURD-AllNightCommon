/**
 * @description: 查询条件组件
 * @author: GP.
 * @date: 2017/10/26.
 */
/***********MyTableTopForm1.0********* */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import { Select, Input, TreeSelect, DatePicker } from 'antd';
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const MonthPicker = DatePicker.MonthPicker;

import moment from 'moment';

class TableTopForm {
  constructor(props) {
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
    this.props = props;
  }


  render() {
    let { content } = this.props;
    let { dataArr, updateItem } = this.props;
    let selectProps = this.selectProps;
    let inputProps = this.inputProps;
    let treeSelectProps = this.treeSelectProps;

    return dataArr && dataArr.map((item, key) => {
      let rts;
      switch (item.type) {

        case 'select': {
          rts = <Select
            {...selectProps}
            style={{ width: '100%', ...item.style }}
            value={
              content[item.valueKey] || undefined
            }
            key={key}
            onChange={(val) => {
              updateItem({ [item.valueKey]: val });
            }}
            placeholder={item.placeholder}
          >
            {
              item.list && item.list.map(
                (item, key) => {
                  return <Option key={item.id}>{item.name}</Option>
                }
              )
            }
          </Select >
          break;
        }
        case 'input': {
          rts = <Input {...inputProps} value={content[item.valueKey] || undefined} placeholder={item.placeholder}
            key={key}
            onChange={(e) => {
              updateItem({ [item.valueKey]: e.target.value });
            }}
          />
          break;
        }
        case 'treeSelect': {
          rts = <TreeSelect  {...treeSelectProps} placeholder={item.placeholder} key={key}
            value={content[item.valueKey] || undefined} treeData={item.treeData}
            multiple={item.multiple ? item.multiple : false}
            onChange={(value, label, extra) => {
              updateItem({ [item.valueKey]: value });
            }}
          />
          break;
        }
        case 'rangePickerByTwoVar': {





          break;
        }
        case 'rangePicker': {
          if (item.valueKey instanceof Array && item.valueKey.length >= 2) {
            rts = <RangePicker style={{ width: '100%' }} key={key}
              value={[
                content[item.valueKey[0]] ? moment(content[item.valueKey[0]])  : undefined,
                content[item.valueKey[1]] ? moment(content[item.valueKey[1]])  : undefined,
              ]}
              onChange={(dates, dateStrings) => {
                updateItem({ 
                  [item.valueKey[0]]: dateStrings[0],
                  [item.valueKey[1]]: dateStrings[1]  
                });
              }
              }
            />
          } else {
            rts = <RangePicker style={{ width: '100%' }} key={key}
              value={[
                content[item.valueKey] ? (content[item.valueKey][0] ? moment(content[item.valueKey][0]) : undefined) : undefined,
                content[item.valueKey] ? (content[item.valueKey][1] ? moment(content[item.valueKey][1]) : undefined) : undefined,
              ]}
              onChange={(dates, dateStrings) => {
                updateItem({ [item.valueKey]: dateStrings });
              }
              }
            />
          }
          break;
        }
        case 'monthRangePicker': {
          rts = <div style={{ width: '100%' }} key={key}>
            <div style={{ display: 'inline-block', width: '47%', }}>
              <MonthPicker
                allowClear={true}
                placeholder={item.isPlaceHolderCurtime ? `不填默认为${moment().format('YYYY-01')}` : item.placeholder1}
                value={content[item.valueKey1] ? (content[item.valueKey1] ? moment(content[item.valueKey1]) : undefined) : undefined}
                disabledDate={item.isNeedDisableDate ? (startValue) => {

                  const endValue = moment(content[item.valueKey2]);

                  if (!startValue || !endValue) {
                    return false;
                  }
                  {/* return true; */ }
                  return startValue.valueOf() > endValue.valueOf();
                } : null}
                onChange={
                  (dates, dateStrings) => {
                    updateItem({ [item.valueKey1]: dateStrings });
                  }
                }
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'inline-block', minWidth: '15px', width: '6%', textAlign: 'center' }}>至</div>
            <div style={{ display: 'inline-block', width: '47%', }}>
              <MonthPicker
                allowClear={true}
                value={content[item.valueKey2] ? (content[item.valueKey2] ? moment(content[item.valueKey2]) : undefined) : undefined}
                placeholder={item.isPlaceHolderCurtime ? `不填默认为${moment().format('YYYY-MM')}` : item.placeholder2}
                disabledDate={item.isNeedDisableDate ? (endValue) => {
                  const startValue = moment(content[item.valueKey1]);
                  let curValue = moment().format('YYYY-MM');

                  if (!startValue || !endValue) {
                    return false;
                  }
                  return endValue.valueOf() <= startValue.valueOf() && endValue.valueOf() >= curValue.valueOf();
                } : null}
                onChange={(dates, dateStrings) => {
                  updateItem({ [item.valueKey2]: dateStrings });
                }
                }
                style={{ width: '100%' }}
              />
            </div>
          </div>
          break;
        }
        case 'dataPicker': {
          rts = <DatePicker style={{ width: '100%' }} key={key}
            value={content[item.valueKey] ? moment(content[item.valueKey][0]) : undefined}
            onChange={(dates, dateStrings) => {
              updateItem({ [item.valueKey]: dateStrings });
            }
            }
          />
          break;
        }

        default:
          break;
      }
      return rts;
    })

  }
}


export default TableTopForm;
