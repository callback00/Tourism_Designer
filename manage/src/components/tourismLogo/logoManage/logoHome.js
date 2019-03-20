import assign from 'lodash.assign'
import React from 'react'
import { message, Divider, Popconfirm, Table, Input } from 'antd'
const Search = Input.Search;
import LogoModal from './logoModal'
import tools from '../../../utils/tools'

class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            pagination: {
                showQuickJumper: true,
                showSizeChanger: true
            },

            logoId: null,

            modalKey: 0,
            logoModalVisible: false,
        }
    }

    componentDidMount() {
        this.getLogoList()
    }

    getLogoList(searchValue) {
        tools.post('/tourismLogo/getLogoList', (json) => {
            if (json.success) {
                this.setState({ data: json.success });
            } else {
                message.error(json.error)
            }
        }, { searchCondition: searchValue })
    }

    // 编辑或添加角色弹出框
    logoModalShow(record) {
        const modalKey = this.state.modalKey + 1;
        this.setState({
            logoModalVisible: true,
            modalKey,
            logoId: record ? record.id : null,
            logoName: record.logoName,
        });
    }

    handleLogoOk() {
        this.setState({
            logoModalVisible: false
        });

        this.getLogoList();

        message.success("添加成功")
    }

    handleLogoCancel() {
        this.setState({
            logoModalVisible: false
        });
    }

    // 删除角色
    deleteBtnClick(logoId) {
        tools.del('/tourismLogo/logoDelete', (json) => {
            if (json.success) {
                message.success(json.success);
                this.getLogoList();
            } else {
                message.error(json.error);
            }
        }, { id: logoId })
    }

    renderTableHeader() {
        return (
            <div className="search-table-head">
                <button className='btn-add' onClick={this.logoModalShow.bind(this)}>新增</button>
                <Search
                    placeholder="请输入查询关键字"
                    onSearch={value => this.getLogoList(value)}
                    enterButton
                    style={{ width: 200 }}
                />
            </div>
        )
    }

    render() {
        const dataSource = this.state.data.map((data, index) => {
            return assign({}, data, {
                key: index,
                index: index + 1
            })
        })

        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index'
        }, {
            title: '设计图名称',
            dataIndex: 'logoName',
            key: 'logoName',
        }, {
            title: '描述',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                return (
                    <span>
                        <a onClick={this.logoModalShow.bind(this, record)} >编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm onConfirm={this.deleteBtnClick.bind(this, record.id)} okText="确定" cancelText="取消" title="确定要删除此条记录吗？">
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        }]

        return (
            <div style={{ background: 'white', padding: '15px' }} >
                <Table
                    title={this.renderTableHeader.bind(this)}
                    columns={columns}
                    dataSource={dataSource}
                    loading={this.state.loading}
                    pagination={this.state.pagination}
                    bordered
                    size="small"
                />

                <div>
                    <LogoModal
                        visible={this.state.logoModalVisible}
                        logoId={this.state.logoId}
                        key={'logo' + this.state.modalKey}
                        modalKey={this.state.modalKey}
                        onOk={this.handleLogoOk.bind(this)}
                        onCancel={this.handleLogoCancel.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

export default Page
