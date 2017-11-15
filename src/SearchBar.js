import React, { Component } from 'react';
import { Paper, IconButton, Input, CircularProgress } from 'material-ui';
import SearchIcon from 'material-ui-icons/Search';
import Clear from 'material-ui-icons/Clear';

import PropType from 'prop-types';
import debounce from 'lodash.debounce';

export default class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showClearButton: props.showClearButton && props.value && props.value.length,
            value: props.value
        };
    }

    componentDidMount() {
        this.createNotifier(this.props.debounceTime);
    }


    componentWillReceiveProps({ value, debounceTime, showClearButton, isLoading }) {
        this.setState((state) => {
            return {
                value,
                showClearButton: showClearButton && value && value.length,
                isLoading
            };
        });
        this.createNotifier(debounceTime);
    }

    createNotifier = debounceTime => {
        if (debounceTime <= 0) {
            this.notify = () => null;
        } else {
            const debouncedFunction = debounce(value => {
                this.doNotify(value);
            }, debounceTime);

            this.notify = (value) => {
                debouncedFunction(value);
            }
        }
    };

    doNotify = (...args) => {
        this.props.onChange(...args);
    };

    handleTextChangeEvent = (event) => {
        event.persist();
        const value = event.target.value;
        this.setState((state) => {
            return {
                value, showClearButton: value && value.length
            };
        });

        if (value.length >= this.props.minCharacterLength) {
            this.notify(value);
        }
    };

    handleTextClearEvent = () => {
        this.setState({
            value: '',
            showClearButton: false
        });
    };

    render() {
        return (
            <Paper className="paperContainer">
                <IconButton>
                    {
                        (this.props.isLoading && this.state.showClearButton) ? <CircularProgress className="iconStyle" thickness={4} size={25} /> :
                            <SearchIcon className="iconStyle" />
                    }
                </IconButton>
                <Input fullWidth disableUnderline={true} className="inputContainer"
                    onChange={this.handleTextChangeEvent} value={this.state.value}
                    placeholder={this.props.placeholder}
                />
                {
                    this.state.showClearButton && <IconButton onClick={this.handleTextClearEvent}>
                        <Clear className="iconStyle" />
                    </IconButton>
                }
            </Paper>
        );
    }
}

SearchBar.propTypes = {
    placeholder: PropType.string,
    debounceTime: PropType.number,
    onChange: PropType.func.isRequired,
    minCharacterLength: PropType.number,
    showClearButton: PropType.bool,
    isLoading: PropType.bool,
    value: PropType.oneOfType([
        PropType.string,
        PropType.number
    ])
};

SearchBar.defaultProps = {
    placeholder: 'Search..',
    debounceTime: 0,
    minCharacterLength: 3,
    value: undefined,
    showClearButton: true,
    isLoading: false
};

SearchBar.styles = {
    paperContainer: {
        display: 'flex',
        height: '50px',
        'justify-content': 'space-between'
    },
    inputContainer: {
        'align-self': 'center',
        'outline': 'none'
    },
    iconStyle: {
        width: '1em',
        height: '1em'
    }
}