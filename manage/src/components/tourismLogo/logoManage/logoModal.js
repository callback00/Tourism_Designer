import React from 'react'
import { message, Modal, Form, Input, InputNumber } from 'antd'
import tools from '../../../utils/tools'
import EditableTagGroup from '../editableTagGroup/editableTagGroup'

const FormItem = Form.Item;
const { TextArea } = Input;

message.config({
    top: 200,
});

class page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                keyWord: []
            },
        };
    }

    componentDidMount() {
        if (this.props.logoId) {
            tools.post('/tourismLogo/getLogoById', (json) => {
                if (json.success) {
                    this.setState({ data: json.success });
                } else {
                    message.error(json.error);
                }
            }, { id: parseInt(this.props.logoId) })
        }
    }

    handleOk(event) {

        event.preventDefault();

        const id = this.props.logoId;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.data && this.state.data.id) {

                    tools.post('/tourismLogo/logoEdit', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { id, data: { ...values } })
                } else {
                    tools.post('/tourismLogo/logoCreate', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { data: values })
                }
            }
        })

    }

    handleCancel() {
        this.props.onCancel()
    }

    tagOnChange(tags) {
        const data = this.state.data
        data.tags = tags
        this.setState({
            data
        })
    }

    renderModal() {

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="设计图名称"
                >
                    {getFieldDecorator('logoName', {
                        initialValue: this.state.data.logoName,
                        rules: [{ required: true, message: '请输入设计图名称' }]
                    })(
                        <Input placeholder="请输入设计图名称" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="搜索关键字"
                >
                    {getFieldDecorator('keyWord')(
                        <EditableTagGroup tags={this.state.data.keyWord} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="正文描述"
                >
                    {getFieldDecorator('remark', {
                        initialValue: this.state.data.remark,
                    })(
                        <TextArea rows={3} placeholder="正文描述" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="标准图片url"
                >
                    {getFieldDecorator('logoImageUrl', {
                        initialValue: this.state.data.logoImageUrl,
                        rules: [{ required: true, message: '请输入完整url' }]
                    })(
                        <Input placeholder="请输入完整url" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="设计图url"
                >
                    {getFieldDecorator('schemeUrl', {
                        initialValue: this.state.data.schemeUrl,
                        rules: [{ required: true, message: '请输入完整url' }]
                    })(
                        <Input placeholder="请输入完整url" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="设计图下载金额"
                >
                    {getFieldDecorator('amount', {
                        initialValue: this.state.data.amount,
                        rules: [{ required: true, message: '请输入设计图下载金额' }]
                    })(
                        <InputNumber style={{ width: 200 }} placeholder="请输入设计图下载金额" />
                    )}
                </FormItem>
            </Form>
        )
    }

    render() {
        return (
            <Modal
                title={this.state.data.id ? '编辑数据' : '新增数据'}
                visible={this.props.visible}
                key={this.props.modalKey}
                onOk={this.handleOk.bind(this)}
                okText="保存"
                onCancel={this.handleCancel.bind(this)}
                cancelText="关闭"
            >
                {this.renderModal()}
            </Modal>
        )
    }
}

page = Form.create()(page)

export default page