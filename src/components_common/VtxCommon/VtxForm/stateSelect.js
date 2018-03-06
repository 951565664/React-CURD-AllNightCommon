import React from 'react';
import { Select } from 'antd';
import styles from './stateSelect.less';

class StateSelect extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const {errorMsg=' ', validated=true} = this.props;
        const selectProps = {
            style:{width:300},
            ...this.props,
        };
        delete selectProps.errorMsg;
        delete selectProps.validated;
        return (
            <div className={validated? styles.normal: styles.error} data-errorMsg={errorMsg}>
                <Select {...selectProps}/>
            </div>
        )
    }
}


export default StateSelect;