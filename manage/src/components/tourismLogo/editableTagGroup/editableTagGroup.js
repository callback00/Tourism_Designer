
import React from 'react'
import {
    Tag, Input, Tooltip, Icon,
} from 'antd';

class EditableTagGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: props.tags ? props.tags : props.value,
            inputVisible: false,
            inputValue: '',
        };
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.tags !== this.props.tags){
            this.setState({ tags: nextProps.tags })
        }
    }

    handleClose(removedTag) {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });

        this.props.onChange(tags);
    }

    showInput() {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange(e) {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm() {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });

        this.props.onChange(tags);
    }

    render() {
        let { tags, inputVisible, inputValue } = this.state;

        tags = tags ? tags : []
        return (
            <div>
                {tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag key={tag} afterClose={() => this.handleClose.bind(this, tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible && (
                    <Input
                        ref={element => this.input = element}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange.bind(this)}
                        onBlur={this.handleInputConfirm.bind(this)}
                        onPressEnter={this.handleInputConfirm.bind(this)}
                    />
                )}
                {!inputVisible && (
                    <Tag
                        onClick={this.showInput.bind(this)}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                    >
                        <Icon type="plus" /> New Tag
            </Tag>
                )}
            </div>
        );
    }
}

export default EditableTagGroup