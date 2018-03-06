import React, {Component,PropTypes} from 'react';
import styles from './VtxTreeSelect.less';

import { TreeSelect , Tooltip } from 'antd';
const TreeNode = TreeSelect.TreeNode;
class VtxTreeSelect extends React.Component{
    constructor(props){
        super(props);
        this.disableCheckboxKeys = [];
        this.disableKeys = [];
        this.state = {
            value: []
        };
    }
    onChange(value, label, extra){
        let t = this,v = [],l = [];
        //单选时,返回的value是字符串,转成数组统一操作
        if(typeof(value) === 'string'){
            value = [value];
        }
        //判断当前选择的节点是否是disabled的数据
        if(t.disableKeys.indexOf(value[value.length - 1]) !== -1){
            return false;
        }
        //v == value 未disabled的value,l == label未disabled的label;
        if('onChange' in t.props && typeof(t.props.onChange) === 'function'){
            if(t.props.treeCheckable){//多选时
                value.map((item,index)=>{
                    if(t.disableCheckboxKeys.indexOf(item) == -1){
                        v.push(item);
                        l.push(label[index]);
                    }
                });
                t.props.onChange({allValue: value,allLabel: label,value: v, label: l});
            }else{
                t.props.onChange({allValue: value,allLabel: label,value: value, label: label});
            }
        }
        this.setState({
            value: value
        });
    }
    //判断对应参数是否是数组
    isArray(ary){
        return Object.prototype.toString.call(ary) === '[object Array]';
    }
    render(){
        let t = this;
        let treeSelect = t.props;
        let TreeSelectProps = {
            style: treeSelect.style || { width: 300 },
            dropdownStyle: treeSelect.dropdownStyle || { maxHeight: 400, overflow: 'auto' },
            value: treeSelect.value || t.state.value,
            treeDefaultExpandedKeys: treeSelect.treeDefaultExpandedKeys || [],

            showSearch: treeSelect.treeCheckable || treeSelect.multiple?false:(treeSelect.showSearch || false),
            multiple: treeSelect.treeCheckable || treeSelect.multiple || false,
            treeCheckable: treeSelect.treeCheckable || false,
            disabled: treeSelect.disabled || false,
            treeDefaultExpandAll: treeSelect.treeDefaultExpandAll || false,

            onChange: t.onChange.bind(t),
            // onSelect: t.onSelect.bind(t),

            treeNodeLabelProp: 'name',
            treeNodeFilterProp: 'name',
            placeholder: treeSelect.placeholder || '',
            searchPlaceholder: treeSelect.searchPlaceholder || '',
        }
        //加载节点树
        let loop = (data) => {
            //检索传入树的数据格式是否正确
            if(typeof(data) !== 'object' || (!data.length && data.length !== 0)){
                return false;
            }
            let render = data.map((item,index)=>{
                let name = item.name;
                let disabledClass = item.disabled || treeSelect.disabledAll?'disable':'';
                let _title = (
                    !!item.icon ?
                    <div className={`stNode ${disabledClass}`}>
                        <i className={`iconfont ${item.icon} ${item.iconClassName || ''} icf`}></i>
                        {name}
                    </div>
                    :
                    (
                        !!item.img ?
                        <div className={`stNode ${disabledClass}`}>
                            <img src={item.img} alt="" className={'imgs'}/>
                            {name}
                        </div>
                        :
                        <div className={`stNode ${disabledClass}`}>
                            {name}
                        </div>
                    )
                );
                _title = (
                    <Tooltip placement="right" title={name}>
                        {_title}
                    </Tooltip>
                );
                let TreeNodeProps = {
                    // disabled: item.disabled || (treeSelect.disabledAll?true:false),
                    disableCheckbox:  item.disableCheckbox || (treeSelect.disableCheckboxAll?true:false),
                    title: _title,
                    key: item.key,
                    name: name,
                    value: item.key,
                    isLeaf: item.isLeaf || false,
                }
                return(
                    <TreeNode {...TreeNodeProps} >
                    {
                        //子节点数据处理,避免数据异常
                        (('children' in item) && t.isArray(item.children))?
                        loop(item.children):''
                    }
                    </TreeNode>
                );
            });
            return render;
        } 
        return (
            <div className={styles.vtxtreeselect}>
                <TreeSelect {...TreeSelectProps}>
                    {
                        loop(treeSelect.data)
                    }
                </TreeSelect>
            </div>
        );
    }
    componentDidMount(){
        let t = this;
        let disableCheckboxKeys = [], disableKeys =[];
        let getKeys = (data)=>{
            data.map((item,index)=>{
                if(item.disabled || t.props.disabledAll){
                    t.disableKeys.push(item.key);
                }
                if(item.disableCheckbox || t.props.disableCheckboxAll){
                    t.disableCheckboxKeys.push(item.key);
                }
                if(t.isArray(item.children)){
                    getKeys(item.children);
                }
            });
        }
        //记录下所有disabled的keys,用于阻断选择事件
        getKeys(t.props.data);
    }
    componentDidUpdate(prevProps, prevState) {//重新渲染结束
        let t = this;
        let disableCheckboxKeys = [], disableKeys =[];
        let getKeys = (data)=>{
            data.map((item,index)=>{
                if(item.disabled || t.props.disabledAll){
                    t.disableKeys.push(item.key);
                }
                if(item.disableCheckbox || t.props.disableCheckboxAll){
                    t.disableCheckboxKeys.push(item.key);
                }
                if(t.isArray(item.children)){
                    getKeys(item.children);
                }
            });
        }
        //记录下所有disabled的keys,用于阻断选择事件
        getKeys(t.props.data);
    }
    componentWillReceiveProps(nextProps) {//已加载组件，收到新的参数时调用
        let t = this;
    }
}

export default VtxTreeSelect;