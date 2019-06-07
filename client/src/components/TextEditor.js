import React, {Component} from "react";

const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_F2 = 113;

export default class TextEditor extends Component {
    constructor(props) {
        super(props);

        this.cancelBeforeStart = this.props.charPress;

        this.state = this.createInitialState(props);

        this.onKeyDown = this.onKeyDown.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    createInitialState(props) {
        let startValue;
        let highlightAllOnFocus = true;

        if (props.keyPress === KEY_BACKSPACE || props.keyPress === KEY_DELETE) {
            // if backspace or delete pressed, we clear the cell
            startValue = '';
        } else if (props.charPress) {
            // if a letter was pressed, we start with the letter
            startValue = props.charPress;
            highlightAllOnFocus = false;
        } else {
            // otherwise we start with the current value
            startValue = props.value;
            if (props.keyPress === KEY_F2) {
                highlightAllOnFocus = false;
            }
        }

        return {
            value: startValue,
            highlightAllOnFocus
        }
    }

    componentDidMount() {
        this.refs.input.addEventListener('keydown', this.onKeyDown);

    }

    componentWillUnmount() {
        this.refs.input.removeEventListener('keydown', this.onKeyDown);
    }

    afterGuiAttached() {
        // get ref from React component
        const eInput = this.refs.input;
        eInput.focus();
        if (this.state.highlightAllOnFocus) {
            eInput.select();

            this.setState({
                highlightAllOnFocus: false
            })
        } else {
            // when we started editing, we want the carot at the end, not the start.
            // this comes into play in two scenarios: a) when user hits F2 and b)
            // when user hits a printable character, then on IE (and only IE) the carot
            // was placed after the first character, thus 'apply' would end up as 'pplea'
            const length = eInput.value ? eInput.value.length : 0;
            if (length > 0) {
                eInput.setSelectionRange(length, length);
            }
        }
    }

    getValue() {
        return this.state.value;
    }

    isCancelBeforeStart() {
        return this.cancelBeforeStart;
    }

    // not very practical, but demonstrates the method.
    isCancelAfterEnd() {
        // return this.state.value > 1000000;
    };

    onKeyDown(event) {
        if (this.isLeftOrRight(event) || this.deleteOrBackspace(event)) {
            event.stopPropagation();
            return;
        }

    }

    isLeftOrRight(event) {
        return [37, 39].indexOf(event.keyCode) > -1;
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <input ref="input"
                   value={this.state.value}
                   onChange={this.handleChange}
                   style={{width: "100%"}}
            />
        );
    }

    deleteOrBackspace(event) {
        return [KEY_DELETE, KEY_BACKSPACE].indexOf(event.keyCode) > -1;
    }
}
