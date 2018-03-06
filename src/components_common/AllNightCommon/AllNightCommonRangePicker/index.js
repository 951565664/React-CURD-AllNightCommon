'use strict'
import moment from 'moment';

import React from 'react'
import styles from './index.less'
import { DatePicker } from 'antd';
export default class AllNightCommonRangePicker extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  disabledStartDate = (startValue) => {
    const endValue = moment(this.props.value[1]);
    if (!this.props.value[0] || !startValue || !endValue) {
      return false;
    }
      // return false;
      return startValue.valueOf() > moment().valueOf();
  }

  disabledEndDate = (endValue) => {

    if (typeof (this.props.disabledEndDate) === 'function') {
      return this.props.disabledEndDate(endValue);
    } else {
      const startValue = moment(this.props.value[0]);
      if (!this.props.value[0] || !endValue || !startValue) {

        return false;
      }
      // let M = startValue.month();
      // let Y = startValue.year();
      let endDisabled = false

      switch (this.props.rangeType) {
        case 'thisMonth':
          endDisabled = endValue.valueOf() >= moment(startValue.format('YYYY-MM')).endOf('month').valueOf();
          break;

        default:
          break;
      }


      return endValue.valueOf() <= startValue.valueOf() || endDisabled || endValue.valueOf() > moment().valueOf();
    }

  }


  onStartChange = (startValue, startDataString) => {
    let _format = this.props.format || 'YYYY-MM-DD';
    let endDateString = moment(this.props.value[1]).format(_format);
    let endDate = moment(endDateString);

    switch (this.props.rangeType) {
      case 'thisMonth':{
        let flag = endDate.valueOf()<startValue.valueOf() || endDate.valueOf() >= moment(startValue.format('YYYY-MM')).endOf('month').valueOf();
      
        endDateString = flag?startDataString:endDateString;
        endDate = flag?startValue:endDate;
        break;
      }
      default:
        break;
    }
    let newDate = [
      startValue,
      endDate
    ];
    let newDateString = [
      startDataString,
      endDateString
    ];
    typeof (this.props.onChange) === 'function' && this.props.onChange(newDate, newDateString);
  }
  onEndChange = (date, dateString) => {
    let newDate = [
      moment(this.props.value[0]),
      date,
    ];
    let _format = this.props.format || 'YYYY-MM-DD';
    let newDateString = [
      moment(this.props.value[0]).format(_format),

      dateString,
    ];
    typeof (this.props.onChange) === 'function' && this.props.onChange(newDate, newDateString);
  }

  // componentWillMount = () => {
  //   this.setState({
  //     format:this.props.format,
  //   })
  // }
  
  // componentWillReceiveProps = (nextProps) => {
  //   if(nextProps.format != this.state.format){
  //     this.setState({
  //       format:nextProps.format
  //     })
  //   }
  // }
  
  render() {
    const { startValue, endValue, endOpen } = this.state;
    
    let DatePickerProps = {
      ...this.props,
      showTime: this.props.showTime,
      format: this.props.format,
    }
    return (
      <div>
        <DatePicker {...DatePickerProps} style={{ width: "50%" }}
          disabledDate={this.disabledStartDate}
          value={this.props.value instanceof Array ? this.props.value[0] : undefined}
          placeholder="开始日期"
          onChange={this.onStartChange}
          showToday={false}
        />
        <DatePicker {...DatePickerProps} style={{ width: "50%" }}
          disabledDate={this.disabledEndDate}
          value={this.props.value instanceof Array ? this.props.value[1] : undefined}
          placeholder="结束日期"
          onChange={this.onEndChange}
          showToday={false}
        />
      </div>
    );
  }
}