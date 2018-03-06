import React from 'react';
import {Input} from 'antd';
const Search = Input.Search;

const VortexInput = (props) => {
  return (
    <Input {...props} />
  );
};

export const VortexSearch = (props)=>{
    return <Search {...props} />
}

export default VortexInput;