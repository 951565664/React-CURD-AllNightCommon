import React from 'react';
import {Select,Cascader } from 'antd';

const VortexSelect = (props)=>{
    return (
        <Select {...props} />
    )
}

export const VortexCascader = (props)=>{
    return (
        <Cascader {...props} />
    )
}
export const VortexOption = Select.Option;
export const VortexOptGroup = Select.OptGroup;

export default VortexSelect;