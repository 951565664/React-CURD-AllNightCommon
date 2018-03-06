/**
 * @description:
 * @author: GP.
 * @date: 2017/10/26.
 */
import React from 'react';
import styles from './index.less';

class ValidationCpt extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    const {errorMsg=' ', validated=true,loading=false,styleCpt} = this.props;

    let _validated,_errorMsg;
    if(errorMsg instanceof(Array) && validated instanceof(Array)){
      let firstUnmatched = validated.indexOf(false);
      if(firstUnmatched==-1){
        _validated = true;
        _errorMsg = errorMsg[0];
      }
      else{
        _validated = false;
        _errorMsg = errorMsg[firstUnmatched] || '';
      }
    }
    else{
      _errorMsg = errorMsg;
      _validated = validated;
    }

    return (
      <div className={_validated? styles.normal: styles.error} style={styleCpt} data-errorMsg={_errorMsg}>
        {this.props.children?this.props.children:null}
      </div>
    )
  }
}


export default ValidationCpt;
