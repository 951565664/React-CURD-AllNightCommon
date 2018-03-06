'use strict'

import React from 'react'
import styles from './index.less'
import { SketchPicker } from 'react-color'

class AllNightColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    color: this.props.color || '#FFF',
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    typeof (this.props.handleChange) == 'function' && this.props.handleChange(color);
    this.setState({ color: color.hex })
  };
  componentWillReceiveProps = (nextProps) => {

    if (nextProps.color === undefined) {
      this.setState({ color: '#FFF' })
    } else if (nextProps.color != this.state.color) {
      this.setState({ color: nextProps.color, })
    } else {
    }
  }

  render() {



    return (
      <div >
        <div className={styles.swatch} onClick={this.handleClick}>
          <div className={styles.color} style={{ backgroundColor: this.state.color }} />
        </div>
        {
          this.state.displayColorPicker ? <div className={styles.popover}>
            <div className={styles.cover} onClick={this.handleClose} />
            <SketchPicker color={this.state.color} onChange={this.handleChange} />
          </div> : null
        }
      </div>
    )
  }
}

export default AllNightColorPicker