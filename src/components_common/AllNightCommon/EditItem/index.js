/**
 * @description: EditItem 组件，用于展示添加编辑
 * @author: GP.
 */
import React from 'react';
import VtxModal from '../../VtxCommon/VtxModal/VtxModal';
import ValidationCpt from '../ValidationCpt';
import AllNightColorPicker from '../AllNightColorPicker';
import AllNightSearchMap from '../AllNightSearchMap';

import Upload from '../UploadModal/Upload';


import { Input, Icon, Radio, Select, message, DatePicker, Collapse, TreeSelect, Switch, InputNumber,Spin } from 'antd';
const Panel = Collapse.Panel;
const RangePicker = DatePicker.RangePicker;
import styles from '../Item.less';
import { formValidation, } from '../../../utils/toolFunc';
import { DownloadURL, ActionURL } from '../../../services/remoteData';
import moment from 'moment';

const RadioGroup = Radio.Group;
const Option = Select.Option;

const EditItem = (props) => {
  const { modalProps,searchMapProps , contentProps, repeatItem,...otherProps } = props;
  const { itemArrs = [{ header: 11, children: [{}] }] } = props;
  const { isNeedCollapse = false } = props;
  const { updateItem, startVerify, fileListVersion } = contentProps;


  const { checkState } = contentProps;
  const TreeSelectProps = {
    showSearch: true,
    multiple: false,
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    treeNodeFilterProp: "title",
    treeDefaultExpandAll: true,
    allowClear: true,
    style: { width: '300px', display: 'inline-block' },
  };

  const SelectProps = {
    style: { width: '300px' },
    showSearch: true,
    allowClear: true,
    optionFilterProp: 'children',
  }


  const getContentJsx = (item, key) => {
    let styleCpt={ width: item.isLayout ? '720px' : '300px' }
    switch (item.contType) {
      case 'text':
        {
          return (<ValidationCpt styleCpt={styleCpt} key={key}>{
            contentProps[item.contValue] !== undefined ? contentProps[item.contValue] : item.contValue
          }</ValidationCpt>)
        }

      case 'input': {
        return (<ValidationCpt errorMsg={item.errorMsg} styleCpt={styleCpt} key={key}
          validated={
            item.validated ? (
              item.isRepeat ? [
                ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                checkState && repeatItem[item.contValue].val == contentProps[item.contValue] && !repeatItem[item.contValue].loading ? repeatItem[item.contValue].repeat : true
              ] : [
                  ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                ]
            ) : true
          }>
          <Input
            onChange={(e) => {
              updateItem({ [item.contValue]: e.target.value });
            }}
            disabled={item.disabled}
            value={contentProps[item.contValue]}
            placeholder={item.placeholder}
            onBlur={(e) => {
              if (item.isRepeat) {
                if (e.target.value != '' && e.target.value != undefined && e.target.value != null) {
                  startVerify({
                    [item.contValue]: e.target.value,
                  }, contentProps.id);
                }
              }

            }}
          />
        </ValidationCpt>)
      }
      case 'textArea': {
        return (<ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}>
          <Input.TextArea
            onChange={(e) => {
              updateItem({ [item.contValue]: e.target.value });
            }}
            value={contentProps[item.contValue]}
            placeholder={item.placeholder}
          />
        </ValidationCpt>)
      }
      case 'inputNumber': {
        return <ValidationCpt errorMsg={item.errorMsg} key={key}
          validated={
            item.validated ? (
              item.isRepeat ? [
                ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                checkState && repeatItem[item.contValue].val == contentProps[item.contValue] && !repeatItem[item.contValue].loading ? repeatItem[item.contValue].repeat : true
              ] : [
                  ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                ]
            ) : true
          }>
          <InputNumber
            style={{ width: '100%' }}
            onChange={(value) => {
              updateItem({ [item.contValue]: value });
            }}
            step={item.step || 1}
            max={item.max || undefined}
            min={item.min || 0}
            formatter={value => item.formatter ? item.formatter : `${value}`}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            value={contentProps[item.contValue]}
          />
        </ValidationCpt>
      }

      case 'treeSelect':
        {
          return <ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}
            validated={
              item.validated ? (
                item.isRepeat ? [
                  ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  checkState && repeatItem[item.contValue].val == contentProps[item.contValue] && !repeatItem[item.contValue].loading ? repeatItem[item.contValue].repeat : true
                ] : [
                    ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  ]
              ) : true
            }>
            <TreeSelect  {...TreeSelectProps} placeholder={item.placeholder} value={contentProps[item.contValue]} treeData={contentProps[item.treeDataKey]} onChange={(value, label, extra) => {
              updateItem({ [item.contValue]: value });
            }} />
          </ValidationCpt>
        }
      case 'datePicker':
        {
          let cptProps = item.cptProps || {};
          if (item.contValue instanceof Array) {

            return (<div className={styles.datePicker}>
              <ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}
                validated={
                  item.validated ? (
                    item.isRepeat ? [
                      ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue[0]] }) : true, ),
                      checkState && repeatItem[item.contValue[0]].val == contentProps[item.contValue[0]] && !repeatItem[item.contValue[0]].loading ? repeatItem[item.contValue[0]].repeat : true
                    ] : [
                        ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue[0]] }) : true, ),
                      ]
                  ) : true
                }>
                <DatePicker
                  {...cptProps}
                  value={[
                    contentProps[item.contValue[0]] ? moment(contentProps[item.contValue[0]]) : null,
                    contentProps[item.contValue[1]] ? moment(contentProps[item.contValue[1]]) : null
                  ]}

                  onChange={(dates, dateStrings) => {
                    updateItem({
                      [item.contValue[0]]: dateStrings[0],
                      [item.contValue[1]]: dateStrings[1],
                    });
                  }}
                />
              </ValidationCpt></div>)
          } else {
            return (<div className={styles.datePicker}>
              <ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}
                validated={
                  item.validated ? (
                    item.isRepeat ? [
                      ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                      checkState && repeatItem[item.contValue].val == contentProps[item.contValue] && !repeatItem[item.contValue].loading ? repeatItem[item.contValue].repeat : true
                    ] : [
                        ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                      ]
                  ) : true
                }>
                <DatePicker {...cptProps}
                  value={contentProps[item.contValue] ? moment(contentProps[item.contValue]) : null} onChange={(dates, dateStrings) => {
                    updateItem({ [item.contValue]: dateStrings });
                  }} />
              </ValidationCpt></div>)

          }
        }
      case 'rangePicker':
        {
          return <div className={styles.datePicker}>
            <ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}
              validated={
                item.validated ? (
                  item.isRepeat ? [
                    ...item.validated.map((item2) => checkState ? (formValidation({ checkType: item2, checkVal: contentProps[item.contValue[0]] }) && formValidation({ checkType: item2, checkVal: contentProps[item.contValue[1]] })) : true, ),
                    checkState && repeatItem[item.contValue[0]].val == contentProps[item.contValue[0]] && !repeatItem[item.contValue[0]].loading ? repeatItem[item.contValue[0]].repeat : true,
                    checkState && repeatItem[item.contValue[1]].val == contentProps[item.contValue[1]] && !repeatItem[item.contValue[1]].loading ? repeatItem[item.contValue[1]].repeat : true
                  ] : [
                      ...item.validated.map((item2) => checkState ? (formValidation({ checkType: item2, checkVal: contentProps[item.contValue[0]] }) && formValidation({ checkType: item2, checkVal: contentProps[item.contValue[1]] })) : true, ),
                    ]
                ) : true
              }>
              <RangePicker
                format={item.format || "YYYY-MM-DD"}
                showTime={item.showTime||'false'}
                onChange={(dates, dateStrings) => {
                  updateItem({ [item.contValue[0]]: dateStrings[0] });
                  updateItem({ [item.contValue[1]]: dateStrings[1] });
                }}
                style={{ width: '100%' }}
                value={
                  [
                    contentProps[item.contValue[0]] ? moment(contentProps[item.contValue[0]]) : undefined,
                    contentProps[item.contValue[1]] ? moment(contentProps[item.contValue[1]]) : undefined,
                  ]
                }
              />
            </ValidationCpt>
          </div>
        }
      case 'select':
        {
          // let _optionList = contentProps[item.listDataKey] instanceof Array ? _optionList = [...contentProps[item.listDataKey]] : [];
          let _optionList = contentProps[item.listDataKey] instanceof Array ? [...contentProps[item.listDataKey]] : [];
          //如果传了 contName 这个属性，就要考虑现在的值还存不存列表
          if (contentProps[item.contValue] !== undefined && item.contName && contentProps[item.contName]) {
            if (_optionList.map(item => item.id).indexOf(contentProps[item.contValue]) === -1) {
              _optionList = [
                {
                  id: contentProps[item.contValue], name: contentProps[item.contName], disabled: true,
                },
                ..._optionList
              ];
            }
          }

          return (<ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}
            validated={
              item.validated ? (
                item.isRepeat ? [
                  ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  checkState && repeatItem[item.contValue].val == contentProps[item.contValue] && !repeatItem[item.contValue].loading ? repeatItem[item.contValue].repeat : true
                ] : [
                    ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  ]
              ) : true
            }>
            {/* <Select value={_optionList.map(item=>item.id).indexOf(contentProps[item.contValue])==-1?contentProps[item.contName]:contentProps[item.contValue]} {...SelectProps} */}
            <Select value={contentProps[item.contValue]} {...SelectProps}
              onChange={(value) => {

                updateItem({
                  [item.contValue]: value,
                });
                if (item.isRepeat) {
                  if (value != '' && value != undefined && value != null) {
                    startVerify({
                      [item.contValue]: value,
                    }, contentProps.id);
                  }
                }
              }} {...item.otherProps}>
              {
                _optionList.map((item) => {
                  return <Option key={item.id} style={item.disabled ? { display: 'none' } : {}}>{item.name}</Option>
                })
              }
            </Select>
          </ValidationCpt>)
        }
      case 'uploadPic':
        {
          const UploadProps = {
            action: ActionURL,
            downLoadURL: DownloadURL,
            listType: 'picture-card',
            multiple: true,
            accept: 'image/jpg,image/jpeg,image/png,image/bmp',
            fileListVersion: fileListVersion,
            ...item.cptProps,
          };
          return (<ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}
            validated={
              item.validated ? (
                item.isRepeat ? [
                  ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  checkState && repeatItem[item.contValue].val == contentProps[item.contValue] && !repeatItem[item.contValue].loading ? repeatItem[item.contValue].repeat : true
                ] : [
                    ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  ]
              ) : true
            }>
            <Upload {...UploadProps} fileList={contentProps[item.contValue] || []}
              onSuccess={(file) => {
                let prevfileList = contentProps[item.contValue] instanceof Array ? [...contentProps[item.contValue]] : [];
                updateItem({
                  [item.contValue]: [...prevfileList, file].map(({ name, id }) => ({ id, name }))
                });
                message.success(`${file.name} 上传成功`, 2);
              }}
              onError={(res) => {
                message.info(`${res.name} 文件上传失败.`, 2);
              }}
              onRemove={(file) => {
                updateItem({
                  [item.contValue]: contentProps[item.contValue].filter((item) => item.id != file.id).map(({ name, id }) => ({ id, name }))
                });
              }}
            />

          </ValidationCpt>)
        }
      case 'uploadFile':
        {
          const UploadProps = {
            action: ActionURL,
            downLoadURL: DownloadURL,
            listType: 'text',
            multiple: true,
            fileListVersion: fileListVersion,

          };
          return <ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}
            validated={
              item.validated ? (
                item.isRepeat ? [
                  ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  checkState && repeatItem[item.contValue].val == contentProps[item.contValue] && !repeatItem[item.contValue].loading ? repeatItem[item.contValue].repeat : true
                ] : [
                    ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  ]
              ) : true
            }>
            <Upload {...UploadProps} fileList={contentProps[item.contValue] || []}
              onSuccess={(file) => {
                let prevfileList = contentProps[item.contValue] instanceof Array ? [...contentProps[item.contValue]] : [];
                updateItem({
                  [item.contValue]: [...prevfileList, file].map(({ name, id }) => ({ id, name }))
                });
                message.success(`${file.name} 上传成功`);
              }}
              onError={(res) => {
                message.info(`${res.name} 文件上传失败.`);
              }}
              onRemove={(file) => {
                updateItem({
                  [item.contValue]: contentProps[item.contValue].filter((item) => item.id != file.id).map(({ name, id }) => ({ id, name }))
                });
              }}
            />

          </ValidationCpt>
        }
      case 'radio':
        {
          return (<ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}
            validated={
              item.validated ? (
                item.isRepeat ? [
                  ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  checkState && repeatItem[item.contValue].val == contentProps[item.contValue] && !repeatItem[item.contValue].loading ? repeatItem[item.contValue].repeat : true
                ] : [
                    ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  ]
              ) : true
            }>
            <RadioGroup
              onChange={(e) => {
                updateItem({ [item.contValue]: e.target.value });
              }}
              value={contentProps[item.contValue]}
              placeholder={item.placeholder}
            >
              {item.radioContent.map((obj) => {
                return (<Radio value={obj.value} key={obj.value}> {obj.text}</Radio>)
              })}
            </RadioGroup>
          </ValidationCpt>)
        }
      case 'switch':
        {
          return (
            <ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}
              validated={
                item.validated ? (
                  item.isRepeat ? [
                    ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                    checkState && repeatItem[item.contValue].val == contentProps[item.contValue] && !repeatItem[item.contValue].loading ? repeatItem[item.contValue].repeat : true
                  ] : [
                      ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                    ]
                ) : true
              }>
              <Switch
                checked={typeof (contentProps[item.contValue]) === 'string' ? (contentProps[item.contValue] === '0' ? false : true) : contentProps[item.contValue]}
                checkedChildren={item.checkedChildren || "开"}
                unCheckedChildren={item.unCheckedChildren || "关"}
                onChange={(checked) => {
                  updateItem({ [item.contValue]: checked });
                }}
              />
            </ValidationCpt>
          )
        }


      case 'color':
        {
          return (
            <ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}
              validated={
                item.validated ? (
                  item.isRepeat ? [
                    ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                    checkState && repeatItem[item.contValue].val == contentProps[item.contValue] && !repeatItem[item.contValue].loading ? repeatItem[item.contValue].repeat : true
                  ] : [
                      ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                    ]
                ) : true
              }>
              <AllNightColorPicker
                color={contentProps[item.contValue]}
                handleChange={(color) => {
                  updateItem({ [item.contValue]: color.hex });
                }}
              />
            </ValidationCpt>
          )
        }

      case 'searchMap': {
        return (
          <ValidationCpt errorMsg={item.errorMsg} key={key} styleCpt={styleCpt}
            validated={
              item.validated ? (
                item.isRepeat ? [
                  ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  checkState && repeatItem[item.contValue].val == contentProps[item.contValue] && !repeatItem[item.contValue].loading ? repeatItem[item.contValue].repeat : true
                ] : [
                    ...item.validated.map((item2) => checkState ? formValidation({ checkType: item2, checkVal: contentProps[item.contValue] }) : true, ),
                  ]
              ) : true
            }>
            <AllNightSearchMap item={item}
              graphicType={item.graphicType|| 'point'}
              clearDrawnGraph={item.clearDrawnGraph === undefined ? true : item.clearDrawnGraph}
              mapCenter={item.mapCenter|| ((searchMapProps && searchMapProps.mapCenter && searchMapProps.mapCenter.length )=== 2 ? searchMapProps.mapCenter :[])}
              callback={(value) => { updateItem({ [item.contValue]: value })}}
              searchMapProps={searchMapProps}
              
              modal1Visible={modalProps.visible}
              // graphicValue={graphicValue}
              // isDraw={isDraw}
            />

          </ValidationCpt>
        )
      }
      default: {
        return <ValidationCpt key={key} styleCpt={styleCpt}>{contentProps[item.contValue]}</ValidationCpt>
      }
    }
  }
  const getContentItem = (item, key) => {
    return (
      <div key={key} className={item.isLayout ? styles.layout : styles.halfLayout}>
        <div className={item.isRequired ? styles.requiredLabel : styles.label}>
          {item.label}：
    </div>
        {
          getContentJsx(item, key)
        }
      </div>)
  }
  
  return (
    <VtxModal {...modalProps}><Spin spinning={otherProps.loading || false} tip="玩命加载中...">
      {
        isNeedCollapse ?
          <Collapse defaultActiveKey={['0',]} >
            {
              itemArrs.map((item, key) => {
                return (
                  <Panel header={item.header} key={key}>
                    {
                      item.children.map((item, key) => {
                        return getContentItem(item, key)

                      })
                    }
                  </Panel>
                )
              })
            }
          </Collapse>
          :
          <div className={styles.formWrapper}>
            {
              itemArrs.map((item, key) => {
                return getContentItem(item, key)
              })
            }
          </div>
      }</Spin >
    </VtxModal>
  )
}

export default EditItem;
