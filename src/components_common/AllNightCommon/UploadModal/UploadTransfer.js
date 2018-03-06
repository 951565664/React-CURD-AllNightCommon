import React, { Component } from 'react'
import Upload from './Upload';
import PropTypes from 'prop-types'
import Immutable from 'immutable';
const { List } = Immutable;

export default class UploadTransfer extends Component {
    static propTypes = {
        multiple:React.PropTypes.bool,
        fileList: React.PropTypes.array,
        onSuccess: React.PropTypes.func.isRequired,
        onError: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func.isRequired,
    }
    constructor(props){
        super(props);
        this.state={
            fileListVersion:0,
        }
    }

    componentWillReceiveProps(nextProps) {

        if(this.props.fileList.length!=nextProps.fileList.length ||　!(List(nextProps.fileList)).equals(List(this.props.fileList)) ){
            this.setState({
                fileListVersion: this.state.fileListVersion+1
            });
        }


        // if(nextProps.fileList.length == 0){
        //     this.setState({
        //         fileListVersion: this.state.fileListVersion+1
        //     });
        // }
    }
    componentWillUnmount(){

    }


    onSuccess=(file)=> {
        typeof(this.props.onSuccess)=='function' && this.props.onSuccess(file);
    }
    onError=(file)=> {
        typeof(this.props.onError)=='function' && this.props.onError(file);
    }
    onRemove=(file)=> {
        typeof(this.props.onRemove)=='function' && this.props.onRemove(file);
        return false;
    }
    render() {
        let props = {
            multiple:this.props.multiple || true,
            fileList:this.props.fileList || [],
            fileListVersion:this.state.fileListVersion,
            onSuccess:this.onSuccess,
            onError:this.onError,
            onRemove:this.onRemove,

        }

        return (
            <Upload {...props} />
        )
    }
}
