import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import style from './TimeClock.less';
class DropDowndropOnly extends React.Component{
  constructor(props){
    super(props);
    //初始化时间
    let time = new Date().getTime();
    this.state={
      time: time,
      date: this.formatDate(time),
    }
  }
  //时间递增方法
  getFormatTime(){
    let t = this;
    let time = t.state.time;
    if(Timer)
      clearTimeout(Timer);
    Timer=setTimeout(()=>{
      time=new Date();
      t.setState({
        date: t.formatDate(time),
        time:time
      })
      t.getFormatTime();
    },999);
  }
  //格式化数据
  formatDate(time){
      var _d=new Date(time);
      return _d.getFullYear() + "-" 
          +(_d.getMonth()+1<10?'0'+(_d.getMonth()+1):_d.getMonth()+1) + "-" 
          + (_d.getDate()<10?'0'+(_d.getDate()):_d.getDate()) + " " 
          + (_d.getHours()<10?'0'+(_d.getHours()):_d.getHours()) + ":" 
          + (_d.getMinutes()<10?'0'+(_d.getMinutes()):_d.getMinutes()) + ":" 
          + (_d.getSeconds()<10?'0'+(_d.getSeconds()):_d.getSeconds());
  }
  render(){
    return(
      <div className={style.timeClockWrapper}>
        <div className={style.dateTime}>
          <div>
            <span>
              {this.state.date}
            </span>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount(){
    let t = this;
    t.getFormatTime()
  }
  componentWillUnmount() {//移除真是的DOM(等于关闭单页时调用)
    clearTimeout(Timer);
  }
}
DropDowndropOnly.propTypes = {
};

export default connect()(DropDowndropOnly);
