'use strict'

import React from 'react'
import styles from './index.less'
import SearchMap from '../../VtxCommon/VtxSearchMap/VtxSearchMap';
import { Button } from 'antd';
import Map from '../../../components/VtxCommon/Map/Map';
class AllNightSearchMap extends React.Component {
  state = {
    modal1Visible: false,
  };


  showMapSearch = () => {
    this.setState({
      modal1Visible: true
    })
  };
  closeMapSearch = () => {
    if (typeof (this.props.closeModal) === 'function') {
      this.props.closeModal(false)
    }
    this.setState({ modal1Visible: false })
  };

  callback = (value) => {
    if (typeof (this.props.callback) === 'function') {
      this.props.callback(value)
    }
    this.setState({ modal1Visible: false })

  };
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.modal1Visible === false) {
      this.setState({ modal1Visible: false })
    }
  }

  componentWillUnmount() {
  }

  render() {

    let SearchMapProps = {
      /* 
      point:点定位 
      rectangle：绘制矩形
      circle：绘制圆
      polygon：绘制多边形
      polyline: 绘制多折线 
      */
      graphicType: this.props.graphicType,
      clearDrawnGraph: this.props.clearDrawnGraph,
      callback: this.callback,
      mapCenter: this.props.mapCenter,
      modal1Visible: this.state.modal1Visible,/* 此处的“modal1Visible” 不是拼错，而是公共组件定义的就这样 →.→ 详情见searchMap文档 */
      closeModal: this.closeMapSearch
    }
    
    return (
      <div>
        <Button onClick={this.showMapSearch}>去地图</Button>
        <SearchMap {...SearchMapProps}/>
        <div className={styles.mapBox}>
        <Map {...this.props.searchMapProps} />
        </div>
      </div>
    )
  }
}

export default AllNightSearchMap