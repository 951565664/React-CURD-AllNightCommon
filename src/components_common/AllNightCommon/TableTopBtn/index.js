/***********MyTableTopBtn2.0********* */
import React from 'react';
import { Button ,Menu, Dropdown,Icon} from 'antd';
import styles from './index.less';


const TableTopBtn = (props) => {
    const {
        btnArrs,
        btnTypes,
        addOnclick,
        deleteOnclick,
        importOnclick,
        exportOnclick,
        backOnclick,
    } = props;

    var _btnArrs = [];
    var _dropDown = null;

    const exportMenu = (
        <Menu onClick={exportOnclick}>
            <Menu.Item key="selectedRows">导出选中行</Menu.Item>
            <Menu.Item key="currentPage">导出当前页</Menu.Item>
            <Menu.Item key="all">导出全部</Menu.Item>
        </Menu>
    );

    if (btnTypes != undefined) {
        btnTypes.map(
            (item, key) => {
                item == "add" && _btnArrs.push(
                    {
                        icon: "file-add",
                        onClick: addOnclick ? addOnclick : () => { },
                        name: "新增",
                        type: "default",
                        // shape:
                        loading: false,
                    }
                );
                item == "deletes" && _btnArrs.push(
                    {
                        icon: "delete",
                        onClick: deleteOnclick ? deleteOnclick : () => { },
                        name: "删除",
                        type: "default",
                        loading: false,
                    }
                );
                item == "import" && _btnArrs.push(
                    {
                        icon: "cloud-upload-o",
                        onClick: importOnclick ? importOnclick : () => { },
                        name: "导入",
                        type: "default",
                        loading: false,
                    }
                );
                if (item == "export") {
                    _dropDown = <Dropdown overlay={exportMenu} trigger={["click"]}>
                        <Button icon="export">
                            导出 <Icon type="down" />
                        </Button>
                    </Dropdown>;
                };
                item == "back" && _btnArrs.push(
                    {
                        icon: "rollback",
                        onClick: backOnclick ? backOnclick : () => { },
                        name: "返回",
                        type: "default",
                        loading: false,
                    }
                );
            }
        )

    }
    if (btnArrs && btnArrs.length > 0) {
        {
            btnArrs.map((item, key) => {
                _btnArrs.push({ ...item });
            })
        }
    }


    return (
        <div className={styles.myTableTopBtn}>
            {
                (_btnArrs && _btnArrs.length > 0) && _btnArrs.map(
                    (item, key) => (
                        <Button 
                            key={key} icon={item.icon ? item.icon : null} 
                            type={item.type ? item.type : "default"} 
                            onClick={item.onClick ? item.onClick : () => { console.error("onClick参数没有") }}
                            shape={item.shape ? item.shape : null} 
                            loading={item.loading !== undefined ? item.loading : false}>{item.name ? item.name : null}
                        </Button>
                    )
                )

            }
            {/* 导出 */}
            {
                _dropDown ? _dropDown : null
            }
        </div>
    )
}

export default TableTopBtn;
