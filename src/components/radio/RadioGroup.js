import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.css';

class RadioGroup extends Component {
  static propTypes = {
    children: PropTypes.node,
    cls: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  static defaultProps = {
    cls: '',
    disabled: false,
  };

  handleChange = (value) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  renderRadioButtons() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        checked: this.props.value === child.props.value,
        disabled: this.props.disabled || child.props.disabled,
        onChange: this.props.onChange.bind(this, child.props.value),
      }),
    );
  }

  render() {
    const { cls, disabled } = this.props;
    const _cls = classnames('radio-group', {
      disabled,
    }, cls);

    return (
      <div
        className={_cls}
        data-cmp="radio-group"
      >
        {this.renderRadioButtons()}
      </div>
    );
  }
}

export default RadioGroup;
